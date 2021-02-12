import styled, { keyframes } from "styled-components";

import senaiImg from "../../assets/senai.jpg";

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    
    ::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(${senaiImg});
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
        filter: blur(4px); /* deixar a imagem borrada */
        z-index: -1;
    }
`;

const loginAnimation = keyframes`
    0% {
        top: -200px;
        opacity: 0;
        transform: scale(0.01) rotate(360deg);
    }

    100% {
        top: 0px;
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
`;

export const FormLogin = styled.form`
    animation: ${loginAnimation} 1s;
    width: 30%;
    min-width: 300px;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #282a36aa;
    border-radius: 4px;
    box-shadow: 0px 0px 10px black;
    overflow: hidden;
`;

export const Header = styled.header`
    width: 100%;
    padding: 20px;
    border-radius: 4px 4px 0px 0px;
    background-color: var(--dark);
    box-shadow: 0px 2px 4px black;

    > h1 {
        font-size: 24px;
        text-align: center;
        margin-bottom: 10px;
    }

    > h4 {
        text-align: center;
    }
`;

export const Body = styled.section`
    width: 100%;
    padding: 30px;
    padding-top: 10px;
    gap: 10px;
    display: flex;
    flex-direction: column;
`;

export const Button = styled.button`
    width: 100%;
    margin-top: 10px;
`;

