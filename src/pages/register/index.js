import { Container, FormLogin, Header, Body, Button } from "./styles";
import Input from "../../components/input";
import { Link, useHistory } from "react-router-dom";
import {api} from "../../services/api"
import { useState } from "react";
import { signIn } from "../../services/security";
import Loading from "../../components/loading";
import Alert from "../../components/alert";


function Student() {

    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);

    const [message, setMessage] = useState(undefined);

    const [student, setStudent] = useState ({
            ra: "",
            name: "",
            email: "",
            password: "",
            validPassword: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validPassword()) return setMessage({title: "senha", description: "as senhas precisam ser iguais"});

        setIsLoading(true);

        try {
            const {ra, name, email, password} = student;

            const response = await api.post("/students", {
                ra,
                name,
                email,
                password,
            });

            signIn(response.data);

            setIsLoading(false);

            //implementar a autorização

            history.push("/home");

        } catch (error) {
            console.error(error);
            setMessage({title: "algo de errado não está certo", description: error.response.data.error});
            setIsLoading(false);
        }   
    };

    const handleInput = (e) => {
        setStudent({ ...student, [e.target.id]: e.target.value });
    };

    //validação de senha
    const validPassword = () => student.password === student.validPassword;

    //botão desabilitado quando não tiver nenhuma das informações nos campos ou quando estiverem incorretas
    const buttonDisable = () => {
        const {ra, name, email, password} = student;

        if (!ra || !name || !email || !password || !validPassword()) return true;

        return false;
    };

    return (
        <>
            <Alert message={message} type="error" handleClose={setMessage}/>
            {isLoading && <Loading/>}
            <Container>
                <FormLogin onSubmit={handleSubmit}>
                    <Header>
                        <h1> BEM VINDO AO SENAI OVERFLOW </h1>
                        <h4> INFORME SEUS DADOS </h4>
                    </Header>
                    <Body>
                        <Input id="ra"            label="ra"              type="text"     value={student.ra}            handler={handleInput} required/>
                        <Input id="name"          label="nome"            type="name"     value={student.name}          handler={handleInput} required/>
                        <Input id="email"         label="email"           type="email"    value={student.email}         handler={handleInput} required/>
                        <Input id="password"      label="senha"           type="password" value={student.password}      handler={handleInput} required/>
                        <Input id="validPassword" label="confirmar senha" type="password" value={student.validPassword} handler={handleInput} required/>
                        <Button disabled={buttonDisable()}> confirmar </Button>
                        <Link to="/">ou, se já tiver cadastro, clique aqui para entrar</Link>
                    </Body>
                </FormLogin>
            </Container>
        </>
    );
}

export default Student;