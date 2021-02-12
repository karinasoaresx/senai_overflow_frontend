import styled from "styled-components";

export const Container = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 0px;
    transition: width 0.4s;
    height: 80px;
    margin: 10px;
    background-color: ${(props) => props.type === "error" ? "#a83232cc" : "#7fb035cc"};
    border-radius: 4px;
    color: black;
    white-space: nowrap;
    overflow: hidden;

    > span {
        position: absolute;
        top: 5px;
        right: 15px;
        font-size: 20px;
        cursor: pointer;
        transition: 0.2s;

        :hover {
            color: var(--primary);
        }
    }

    > h1 {
        font-size: 18px;
        margin: 5px;
        margin-top: 10px;
        margin-left: 10px;
    }

    > p {
        font-size: 15px;
        margin-left: 5px;
        margin-top: 10px;
        margin-left: 10px;
    }
`;