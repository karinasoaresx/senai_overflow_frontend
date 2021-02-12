import { Container, FormLogin, Header, Body, Button } from "./styles";
import Input from "../../components/input";
import { Link, useHistory } from "react-router-dom";
import {api} from "../../services/api"
import { useState } from "react";
import { signIn } from "../../services/security";
import Loading from "../../components/loading";
import Alert from "../../components/alert";


function Login() {

    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);

    const [message, setMessage] = useState(undefined);

    const [login, setLogin] = useState ({
        email:"",
        password:""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const response = await api.post("/sessions", login);

            signIn(response.data);
            setIsLoading(false);

            history.push("/home");

        } catch (error) {
            console.error(error);
            setMessage({title: "algo de errado não está certo", description: error.response.data.error});
            setIsLoading(false);
        }   
    };

    const handleInput = (e) => {
        setLogin({ ...login, [e.target.id]: e.target.value });
    };

    return (
    <>
        <Alert message={message} type="error" handleClose={setMessage}/>    
        {isLoading && <Loading/>}
        <Container>
            <FormLogin onSubmit={handleSubmit}>
                <Header>
                    <h1> BEM VINDO AO SENAI OVERFLOW </h1>
                    <h4> O SEU PORTAL DE RESPOSTAS </h4>
                </Header>
                <Body>
                    {/* <label> e-mail </label>
                    <input type="email"/>
                    <label> senha </label>
                    <input type="password"/> */}
                    <Input id="email"    label="email" type="email"    value={login.email}    handler={handleInput} required/>
                    <Input id="password" label="senha" type="password" value={login.password} handler={handleInput} required/>
                    <Button> entrar </Button>
                    <Link to="/register">ou clique aqui para se cadastrar</Link> 
                </Body>
            </FormLogin>
        </Container>
    </>    
    );
}

export default Login;