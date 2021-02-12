import { createGlobalStyle } from "styled-components";

//dentro desse codigo coloca o css
export const GlobalStyles = createGlobalStyle`

    /* definir cor padrão */
    :root {
        --dark: #282a36;
        --darkGray: #44475a;
        --black: #000000;
        --light: #edf2f4;
        --primary: #ef233c;
        --secondary: #d90429;
    }

    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }

    /* trilha por onde a rolagem passa */
    ::-webkit-scrollbar-track {
        background-color: var(--darkGray);
    }

    /* scroll como um todo */
    ::-webkit-scrollbar {
        width: 4px;
        background-color: var(--darkGray);
    }

    /* barra de rolagem */
    ::-webkit-scrollbar-thumb {
        background-color: var(--light);
        border-radius: 5px;
    }

    body {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        color: var(--light);/* utilizar as cores que foram definidas no :root */
    }

    button {
        padding: 8px;
        font-weight: bold;
        color: var(--light);
        background-color: var(--dark);
        border-radius: 4px;
        transition: .2s;
        cursor: pointer;

        :hover {
            background-color: var(--darkGray);
        }

        :active {
            transform: scale(0.98);
        }

        :disabled {
            background-color: transparent;
            border: 1px solid var(--primary);
            color: var(--darkGray);
        }
    }

    a {
            color: var(--light);
            transition: .2s;
            text-align: center;

            :hover {
                color: var(--primary);
            }

            :active {
                transform: scale(0.95);
            }
        }

    textarea {
        font-size: 16px;
        padding: 5px;
        resize: none;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }

    select {
        font-size: 16px;
        padding: 5px;
        border-radius: 4px;
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }

`;