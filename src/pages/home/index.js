import { Container, Header, Content, ProfileContainer, FeedContainer, ActionsContainer, QuestionCard, Logo, IconSignOut, FormNewQuestion, GistIcon, ContainerGist } from "./styles";
import imgProfile from "../../assets/foto_perfil.png"
import logo from "../../assets/logo.png"
import { useEffect, useState, useRef } from "react";
import { api } from "../../services/api";
import { signOut, getUser, setUser } from "../../services/security";
import { useHistory } from "react-router-dom";
import { format } from "date-fns";
import Modal from "../../components/modal";
import Input from "../../components/input";
import Select from "../../components/select";
import Tag from "../../components/tag";
import Loading from "../../components/loading";
import Alert from "../../components/alert";
import { validSquaredImage } from "../../utils";
import ReactEmbedGist from "react-embed-gist";

function Profile({ setIsLoading, handleReload, setMessage }) {

    const [student, setStudent] = useState({});

    useEffect(() => {
        setStudent(getUser());
    }, []);

    const handleImage = async (e) => {



        try {
            await validSquaredImage(e.target.files[0]);

            const data = new FormData();

            data.append("image", e.target.files[0]);

            setIsLoading(true);

            const response = await api.post(`/students/${student.id}/images`, data);

            setTimeout(() => {
                setStudent({ ...student, image: response.data.image });

                handleReload();
            }, 1000);

            setUser({ ...student, image: response.data.image });
        } catch (error) {
            alert(error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <section>
                <img src={student.image || imgProfile} alt="imagem de perfil" />
                {/* esconder o input file e deixar a label clicavel */}
                <label htmlFor="idImageProfile"> editar foto </label>
                <input id="idImageProfile" type="file" onChange={handleImage} />
            </section>
            <section>
                <strong> NOME: </strong>
                <p> {student.name} </p>
            </section>
            <section>
                <strong> RA: </strong>
                <p> {student.ra} </p>
            </section>
            <section>
                <strong> E-MAIL: </strong>
                <p> {student.email} </p>
            </section>
        </>
    );
};

function Answer({ answer }) {

    const student = getUser();

    return (
        <section>
            <header>
                <img src={answer.Student.image || imgProfile} alt="imagem de perfil" />
                <strong> por {student.studentId === answer.Student.id ? " você" : answer.Student.name}</strong>
                <p> em {format(new Date(answer.created_at), "dd/MM/yyyy 'às' HH:mm")} </p>
            </header>
            <p>{answer.description}</p>
        </section>
    );
}

function Question({ question, setIsLoading, setCurrentGist }) {

    const [newAnswer, setNewAnswer] = useState("");

    const [answers, setAnswers] = useState([]);

    const [message, setMessage] = useState(undefined);

    useEffect(() => {
        setAnswers(question.Answers);
    }, [question.Answers]);

    const handleAddAnswer = async (e) => {
        e.preventDefault();

        if (newAnswer.length < 10) return setMessage({ title: "algo de errado não está certo", description: "a resposta deve ter no minino 10 caracteres" });

        setIsLoading(true);

        try {
            const response = await api.post(`/questions/${question.id}/answers`, {
                description: newAnswer,
            });

            const aluno = getUser();

            const answerAdd = {
                id: response.data.id,
                description: newAnswer,
                created_at: response.data.createdAt,
                Student: {
                    id: aluno.StudentId,
                    name: aluno.name,
                    image: aluno.image
                },
            };

            setAnswers([...answers, answerAdd]);
            setNewAnswer("");

            setIsLoading(false);
        } catch (error) {
            setMessage({ title: "algo de errado não está certo", description: error });
            setIsLoading(false);
        }
    };

    const [showAnswers, setShowAnswers] = useState(false);

    const qtdAnswers = answers.length;

    const student = getUser();

    return (
        <>
            <Alert message={message} type="error" handleClose={setMessage} />
            <QuestionCard>
                <header>
                    <img src={question.Student.image || imgProfile} alt="imagem de perfil" />
                    <strong> por {student.studentId === question.Student.id ? " você" : question.Student.name}</strong>
                    <p> em {format(new Date(question.created_at), "dd/MM/yyyy 'às' HH:mm")} </p>
                    {question.gist && <GistIcon onClick={() => setCurrentGist(question.gist)} />}
                </header>
                <section>
                    <strong> {question.title} </strong>
                    <p> {question.description} </p>
                    {question.image && <img src={question.image} alt="imagem da publicação" />}
                </section>
                <footer>
                    <h1 onClick={() => setShowAnswers(!showAnswers)}>
                        {qtdAnswers === 0 ? "seja o primeiro a responder" : (
                            <>
                                {qtdAnswers}
                                {qtdAnswers > 1 ? " respostas" : " resposta"}
                            </>
                        )}
                    </h1>
                    {showAnswers && (
                        <>
                            {answers.map((answer) => (
                                <Answer answer={answer} />
                            ))}

                        </>
                    )}
                    <form onSubmit={handleAddAnswer}>
                        <textarea placeholder="responde essa duvida" onChange={e => setNewAnswer(e.target.value)} value={newAnswer} required></textarea>
                        <button> enviar </button>
                    </form>
                </footer>
            </QuestionCard>
        </>
    );
};

function NewQuestion({ handleReload, setIsLoading, isLoading }) {

    const [newQuestion, setNewQuestion] = useState({
        title: "",
        description: "",
        gist: "",
    });

    const [categories, setCategories] = useState([]);

    const [categoriesSel, setCategoriesSel] = useState([]);

    const [message, setMessage] = useState(undefined);

    const [image, setImage] = useState(null);

    const imageRef = useRef();

    const categoriesRef = useRef();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await api.get("/categories");

                setCategories(response.data);
            } catch (error) {
                setMessage({ title: "algo de errado não está certo", description: error });
            }
        }
        loadCategories();
    }, []);

    const handleCategories = (e) => {
        const idSel = e.target.value;

        const categorySel = categories.find((c) => c.id.toString() === idSel);

        //não manda a mesma categoria pras tags e não da bug quando clica no selecione
        if (categorySel && !categoriesSel.includes(categorySel))
            setCategoriesSel([...categoriesSel, categorySel]);

        //deixar a categorias selecionada desabilitada
        e.target[e.target.selectedIndex].disabled = true;

        //sempre voltar pro selecione
        e.target.value = "";
    };

    const handleImage = (e) => {
        if (e.target.files[0]) {
            //mostra a pré-visualização da imagem
            imageRef.current.src = URL.createObjectURL(e.target.files[0]);
            imageRef.current.style.display = "flex";
        } else {
            //quando clicar em 'cancelar' a pré-visualização sai
            imageRef.current.src = "";
            imageRef.current.style.display = "none";
        }

        setImage(e.target.files[0]);
    };

    const handleUnselCategory = (idUnsel) => {
        setCategoriesSel(categoriesSel.filter((c) => c.id !== idUnsel));

        const { options } = categoriesRef.current;

        //habilita a opção novamamente quando é excluída da tag
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === idUnsel.toString()) options[i].disabled = false;
        }
    };

    const handleInput = (e) => {
        setNewQuestion({ ...newQuestion, [e.target.id]: e.target.value });
    };

    const handleAddNewQuestion = async (e) => {
        e.preventDefault();

        console.log("chamou")

        const data = new FormData();

        data.append("title", newQuestion.title);
        data.append("description", newQuestion.description);

        const categories = categoriesSel.reduce((s, c) => (s += c.id + ","), "");

        data.append("categories", categories.substr(0, categories.length - 1));

        if (image) data.append("image", image);
        if (newQuestion.gist) data.append("gist", newQuestion.gist);

        setIsLoading(true);

        try {
            await api.post("/questions", data, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });

            handleReload();
        } catch (error) {
            alert(error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <Alert message={message} type="error" handleClose={setMessage} />
            {isLoading && <Loading />}
            <FormNewQuestion onSubmit={handleAddNewQuestion}>
                <Input id="title" label="titulo" value={newQuestion.title} handler={handleInput} required />
                <Input id="description" label="descrição" value={newQuestion.description} handler={handleInput} required />
                <Input id="gist" label="gist" value={newQuestion.gist} handler={handleInput} />
                <Select id="categories" label="categorias" handler={handleCategories} ref={categoriesRef}>
                    <option value="">selecione</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.description}</option>
                    ))}
                </Select>
                <div>
                    {categoriesSel.map((c) => (
                        <Tag key={c.id} info={c.description} handleClose={() => handleUnselCategory(c.id)}></Tag>
                    ))}
                </div>
                <input type="file" onChange={handleImage} />
                <img alt="pré-visualização" ref={imageRef} />
                <button>enviar</button>
            </FormNewQuestion>
        </>
    );
};

function Gist({ gist, handleClose }) {

    if (gist) {
        const formatedGist = gist.split(".com/").pop();
        return (
            <Modal title="exemplo de código" handleClose={() => handleClose(undefined)}>
                <ContainerGist>
                    <ReactEmbedGist gist={formatedGist} />
                </ContainerGist>
            </Modal>
        );
    } else return null;
};

function Home() {

    const history = useHistory();

    const [questions, setQuestions] = useState([]);

    const [reload, setReload] = useState(null);

    const [showNewQuestion, setShowNewQuestion] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [currentGist, setCurrentGist] = useState(undefined);

    useEffect(() => {
        const loadQuestions = async () => {
            setIsLoading(true);
            const response = await api.get("/feed");

            setQuestions(response.data);

            setIsLoading(false);
        };
        loadQuestions();

    }, [reload]);

    const handleSignOut = () => {
        signOut();

        history.replace("/");
    };

    const handleReload = () => {
        setShowNewQuestion(false);
        setReload(Math.random());
    };

    return (
        <>
            {isLoading && <Loading />}
            <Gist gist={currentGist} handleClose={setCurrentGist} />

            {showNewQuestion && (
                <Modal title="faça uma pergunta" handleClose={() => setShowNewQuestion(false)}>
                    <NewQuestion handleReload={handleReload} setIsLoading={setIsLoading} />
                </Modal>
            )}
            <Container>
                <Header>
                    <Logo src={logo} alt="logo do senai" onClick={handleReload} />
                    <IconSignOut onClick={handleSignOut} />
                </Header>
                <Content>
                    <ProfileContainer>
                        <Profile handleReload={handleReload} setIsLoading={setIsLoading} />
                    </ProfileContainer>
                    <FeedContainer>
                        {questions.map((q) => (
                            <Question question={q} setIsLoading={setIsLoading} setCurrentGist={setCurrentGist} />
                        ))}
                    </FeedContainer>
                    <ActionsContainer>
                        <button onClick={() => setShowNewQuestion(true)}> fazer uma pergunta </button>
                    </ActionsContainer>
                </Content>
            </Container>
        </>
    );
}

export default Home;