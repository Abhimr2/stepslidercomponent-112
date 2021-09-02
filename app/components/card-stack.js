'use strict'

// https://github.com/EnCiv/unpoll/issues/4

import React, { useState, useLayoutEffect, useMemo, useEffect, useReducer } from 'react'
import ReactDom from 'react-dom'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import SvgTrashCan from '../svgr/trash-can'
import SvgPencil from '../svgr/pencil'
import SvgCaret from '../svgr/caret'
import SvgCaretDown from '../svgr/caret-down'
import ActionCard from './action-card'
import TopicCard from './topic-card'

const offsetHeight = 1.25
const Blue = '#418AF9'

export function CardStack(props) {
  const { className, style, cards, shape="open", displacement = 0.1, onShapeChange, onChangeLeadTopic, refresh } = props
  const classes = useStyles(props)

  const [refs, setRefs] = useState([])
  const [lastRefDone, setLastRefDone] = useState(false)
  const [allRefsDone, setAllRefsDone] = useState(false) // don't apply transitions until all refs are done
  const doSetRefs = (i, node) => {
    // i===0 is the first one in cards which should go at the top of the 
    // seems obvious but we are going to render the last card at the bottom and then 
    // then one before that, above it, etc.
    if (!node) delete refs[i]
    else refs[i] = node
    if (node || refs[i]) setRefs([...refs])
  }
  function refHeight(n) {
    const node = refs[n] && ReactDom.findDOMNode(refs[n])
    return node ? node.getBoundingClientRect().height : 0
  }
  // sum height of all children above i
  function aboveHeight(i) {
    let height = 0
    let n = 0
    while (n < i) height += refHeight(n++) * offsetHeight
    return height
  }

  // sum height of all children below i, and reduce to displacement if minimized
  function belowHeight(i) {
    let height = 0
    let n = i + 1
    while (n < refs.length) height += refHeight(n++) * (shape === 'minimized' ? displacement : offsetHeight)
    return height
  }



  const [controlsHeight, setControlsHeight] = useState(0)
  const [instructHeight, setInstructHeight] = useState(0)
  useEffect(() => { dispatch({type: "parentShapeChange", shape}) }, [shape])

  // shapes: minimized, open, add-remove, change-lead

  function reducer(state, action){
    switch(action.type){
      case 'parentShapeChange':
        return {...state, shape: action.shape}
      case 'minimize':
        onShapeChange && onShapeChange("minimized")
        return {...state, shape: "minimized"}
      case 'open':
        onShapeChange && onShapeChange("open")
        return {...state, shape: 'open'}
      case 'toggleSelect': 
        switch(state.shape){
          case "change-lead":
            let index = cards.findIndex(card => card._id === action.id)
            if (index >= 0) {
              let card = cards[index]
              cards.splice(index, 1)
              cards.unshift(card)
            }
            onShapeChange && onShapeChange("open")
            return({...state, shape: 'open'})
          case "add-remove":
            // eject the child
            let idx = cards.findIndex(card => card._id === action.id)
            if (idx >= 0) {
              let card = cards[idx]
              cards.splice(idx, 1)
              if(props.reducer)
                props.reducer({type: "ejectCard", card})
            }
            return {...state, refresh: state.refresh+1} // refresh so there's a state change to cause a redraw because cards is always the same
          case "open":
            return state
          case "minimized": 
            onShapeChange && onShapeChange("open")
            return {...state, shape: 'open'}
          default:
            throw new Error()
        }
      case 'toggleChangeLeadTopic':
        const newShape=state.shape==='change-lead'?'open':'change-lead'
        onShapeChange && onShapeChange(newShape)
        return {...state, shape: newShape}
      case 'clearChangeLeadTopic':
        onShapeChange && onShapeChange("open")
        return {...state, shape: 'open'}
      default: 
        throw new Error()
    }
  }

  const [state, dispatch]=useReducer(reducer,{shape, refresh: 0})

  const reversed = useMemo(
    () =>
      cards
        .map((card, i) => <div ref={node => doSetRefs(i, node)} key={card._id}>{<TopicCard topicObj={card} onToggleSelect={()=>dispatch({type: "toggleSelect", id: card._id})} />}</div>)
        .reverse(),
    [cards, state, refresh]
  ) // reversed so the first child will be rendered last and on top of the other children -
  // memo to prevent rerender loop on state change

  const last = reversed.length - 1
    // without this, on initial render user will see the children drawn in reverse order, and then they will move into the correct order
  useLayoutEffect(() => {
    if (allRefsDone) return
    if (lastRefDone) {
      setAllRefsDone(true)
      return
    }
    refs.length === reversed.length &&
      refs.every(node => ReactDom.findDOMNode(node).clientHeight) &&
      setLastRefDone(true)
  }, [refs, lastRefDone])
  

  const shapeOfChild = i => {
    if (i == last) {
      switch(state.shape){
        case 'change-lead':
        case 'add-remove':
            return 'firstChildLikeInner'
        case 'open':
        case 'minimized':
            return 'firstChild'
      }
    }
    if (i == 0) return 'lastChild'
    return 'innerChild'
  }


  // the wrapper div will not shrink when the children stack - so we force it
  const wrapperHeight =
    state.shape === 'minimized'
      ? controlsHeight + controlsHeight * displacement * 2
      : aboveHeight(cards.length) + controlsHeight * offsetHeight + controlsHeight + instructHeight|| undefined // don't set maxheight if 0, likely on the first time through

  return (
    <div style={{ ...style, height: wrapperHeight }} className={cx(className, classes.wrapper, allRefsDone && classes.transitionsEnabled)}>
      <div className={cx(classes.borderWrapper, classes[state.shape])}>
        <div style={{top: aboveHeight(cards.length)}} 
          className={cx(classes.instruct,classes[state.shape],allRefsDone&&classes.transitionsEnabled)}
          ref={e => e ? setInstructHeight(e.clientHeight) : setInstructHeight(0)}
        >
          {state.shape==="add-remove" ? "Tap on cards to add or remove them" : state.shape==="change-lead" ? "Pick the topick which best represents the group" : ""}
        </div>
        <div
          style={{
            top:
              state.shape === 'minimized'
                ? controlsHeight * displacement
                : aboveHeight(cards.length) + controlsHeight + instructHeight,
          }}
          className={cx(classes.subChild, classes[state.shape], allRefsDone && classes.transitionsEnabled)}
          key="begin"
        >
          <ActionCard
            className={cx(classes.action, classes.flatTop, classes[state.shape], allRefsDone && classes.transitionsEnabled)}
            active={reversed.length > 1 ? "true" : "false"} name="Change Lead Topic"
            onDone={(val) => { dispatch({type: "toggleChangeLeadTopic"}); onChangeLeadTopic && onChangeLeadTopic(!state.shape==='change-lead')}} />
        </div>
        <div
          ref={e => e && setControlsHeight(e.clientHeight)}
          style={{
            top:
              state.shape === 'minimized'
                ? controlsHeight * displacement
                : reversed.length * controlsHeight * offsetHeight + 'px',
          }}
          className={cx(classes.subChild, classes[state.shape], allRefsDone && classes.transitionsEnabled)}
          key="head"
        >
          <div className={cx(classes.controls, classes[state.shape], allRefsDone && classes.transitionsEnabled)}>
            {[<SvgTrashCan />, <SvgPencil />, <SvgCaret onClick={() => dispatch({type: 'minimize'})} />].map(item => <div className={classes.controlsItem}>{item}</div>)}
          </div>
        </div>
        {reversed.map((newChild, i) => (
          <div
            style={{ top: state.shape === 'minimized' ? 0 : `calc( ${aboveHeight(last - i)}px ${(state.shape==="change-lead" || state.shape==="add-remove" )? " + 1rem" : ""})` }}
            className={cx(
              classes.subChild,
              classes[shapeOfChild(i)],
              classes[state.shape],
              allRefsDone && classes.transitionsEnabled
            )}
            key={newChild.key}
          >
            {newChild}
          </div>
        ))}
        <div className={cx(classes.topControls, classes[state.shape])} key="last">
          <div className={classes.controlsItem} />
          <div className={classes.controlsItem} />
          <div className={cx(classes.controlsItem, classes.pointerEvents)}><SvgCaretDown onClick={() => dispatch({type: 'open'})} /></div>
        </div>
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  wrapper: {
    pointerEvents: "none", // there are children that will have pointer events - don't interfere
    '&$transitionsEnabled': {
      transition: '0.5s linear all',
    },
  },
  borderWrapper: {
    position: 'relative',
    border: '1px solid white',
    borderRadius: '1rem',
    height: '100%',
    backgroundColor: 'black',
    borderBottom: 'none',
    borderTop: 'none',
    '&$minimized': {
      border: 'none',
    },
    '&$change-lead': {
      borderTop: '1px solid white',
      borderBottom: '1px solid white'
    },
    '&$add-remove': {
      borderTop: '1px solid white',
      borderBottom: '1px solid white'
    }
  },
  subChild: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    '&$transitionsEnabled': {
      transition: '0.5s linear all',
    },
  },
  minimized: {}, // a shape 
  'open': {}, // a shape
  'add-remove': {}, // a shape
  'change-lead': {}, // a shape
  transitionsEnabled: {},
  controls: {
    pointerEvents: 'auto',
    background: '#000000',
    '&$minimized': {
      backgroundColor: '#949494',
      borderRadius: '0 0 1rem 1rem',
    },
    '&$transitionsEnabled': {
      transition: '0.5s linear all',
    },
    display: 'table',
    tableLayout: 'fixed',
    width: '100%',
    '&$add-remove': {
      display: 'none',
    },
    '&$change-lead': {
      display: 'none',
    }
  },
  topControls: {
    position: 'absolute',
    background: 'transparent',
    '&$minimized': {
      display: 'table'
    },
    display: 'none',
    tableLayout: 'fixed',
    width: '100%'
  },
  controlsItem: {
    fontSize: '2rem',
    color: 'white',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: '2rem',
    '& svg:hover': {
      cursor: 'pointer',
    }
  },
  flatTop: {
    borderRadius: '0 0 1rem 1rem',
    '&$minimized': {
      backgroundColor: '#4C4C4C',
    },
    '&$transitionsEnabled': {
      transition: '0.5s linear all',
    },
  },
  firstChild: {
    position: 'absolute',
    borderRadius: '1rem 1rem 0 0',
    '&$minimized': {
      borderRadius: '1rem',
    },
  },
  firstChildLikeInner: {
    marginLeft: '1rem',
    marginRight: '1rem',
    borderRadius: '1rem',
    '&$minimized': {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  innerChild: {
    marginLeft: '1rem',
    marginRight: '1rem',
    borderRadius: '1rem',
    '&$minimized': {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  lastChild: {
    marginLeft: '1rem',
    marginRight: '1rem',
    borderRadius: '1rem',
    '&$minimized': {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  pointerEvents: {
    pointerEvents: 'all'
  },
  action: {
    '&$add-remove': {
      display: 'none'
    },
    '&$change-lead': {
      display: 'none'
    }
  },
  instruct: {
    display: 'none',
    position: 'relative',
    textAlign: "center",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    color: "white",
    '&$add-remove':{
      display: "inline-block"
    },
    '&$change-lead':{
      display: "inline-block"
    },
    '&$transitionsEnabled': {
      transition: '0.5s linear all',
    },
  }
})

export default CardStack


  /****
   * These are not used right now - but we might need them when we get to variable height cards
  

  function refHeight(n) {
    const node = refs[n] && ReactDom.findDOMNode(refs[n])
    return node ? node.getBoundingClientRect().height : 0
  }

  // sum height of all children above i
  function aboveHeight(i) {
    let height = 0
    let n = 0
    while (n < i) height += refHeight(n++) * offsetHeight
    return height + controlsHeight
  }

  // sum height of all children below i, and reduce to displacement if minimized
  function belowHeight(i) {
    let height = 0
    let n = i + 1
    while (n < refs.length) height += refHeight(n++) * (shape === 'minimized' ? displacement : offsetHeight)
    return height
  }
***/
