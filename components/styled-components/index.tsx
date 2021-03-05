import React from "react";
import styled from "styled-components";
export const Wrapper = styled.div`
    width: 230px;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px #FFFFFF inset, 0 1px 3px rgba(34, 25, 25, 0.4);
    border-radius: 8px;
    color: #555;
    padding: 0px 0px 8px 0px;
    overflow: hidden;

`;
export const Header = styled.div`
    padding: 8px 8px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    background-color:#19A5E1;
`;
export const ArrowBtn = styled.div`
    background-color: #fff;
    border: none;
    color: #19A5E1;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    padding:2px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover{
        background-color:#0ba4e6;
        color:#fff;
    }
`;
export const WeekDaysBox = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 5px 5px;
    grid-auto-rows: 22px;
    padding: 0px 8px;
    font-weight: bold;
    font-size:12px;
    margin-top:6px;
    color:#19A5E1;

`;
export const DateGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-gap: 2px 2px;
    padding: 4px 8px;
`;
export const Day = styled.div<{active?: any}>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5px;
    width: 20px;
    height:20px;
    font-size:12px;
    border-radius: 100%;
    transition:all 0.2s ease-in-out;
    cursor: pointer;
    background-color:${props=>props.active?'#19A5E1':''};
    color: ${props=>props.active?'white':''};
    &:hover{
        background-color: #19A5E1;
        color:#fff;
    }
`;
export const StyledInput = styled.input<{ref?:any}>`
border: 1px solid #555;
border-radius:5px;
padding:5px;
margin-bottom:8px;
`
export const CalenderWrapper = styled.div`
display: flex;
flex-direction:column;
position:relative;
border:1px solid red;
width: 230px;
`
