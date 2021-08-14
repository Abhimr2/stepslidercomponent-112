import React, { useState } from 'react'
import ComponentListSlider from '../app/components/component-list-slider'


export default {
    title: 'ComponentListSlider',
    component: ComponentListSlider,
    argTypes: {},
}

const Template = args => {
    const [backgroundColor, setBackgroundColor] = useState("white")
    return (
        <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: backgroundColor, }}>
            <div
                style={{
                    width: '48em',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    textAlign: 'center',
                    padding: 0,
                    backgroundColor: "black",
                    minHeight: '100vh',
                }}
            >
                <ComponentListSlider {...args} onDone={(val) => val ? setBackgroundColor("black") : setBackgroundColor("white")} />
            </div>
        </div>
    )
}

const Panel = (props) => <div style={{ width: 'inherit', height: '150vh', backgroundColor: props.backGroundColor }} >
    <div style={{ position: 'relative', width: 'inherit', height: 'inherit' }}>
        <button onClick={props.onDone} style={{ position: 'absolute', top: '20vh' }}>Done</button>
    </div>
</div>

const list = [
    <Panel backGroundColor="green" />,
    <Panel backGroundColor="blue" />,
    <Panel backGroundColor="red" />,
    <Panel backGroundColor="purple" />,
]

export const CardListNormal = Template.bind({})
CardListNormal.args = { children: list }

const list2 = [
    <Panel backGroundColor="yellow" />,
    <Panel backGroundColor="gray" />,
    <ComponentListSlider children={list} />,
    <Panel backGroundColor="aqua" />,
    <Panel backGroundColor="magenta" />,
]

export const Nested = Template.bind({})
Nested.args = { children: list2 }
