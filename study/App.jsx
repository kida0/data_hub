import './App.css'

const element1 = <h2>Hello, world!</h2>

function App() {

    return (
        <>
        
        {/* JSX Practice */}

        <h1>JSX</h1>
        <br /> {/* 단독 태그도 /로 닫아줘야 함 */}
        {element1}
        Hello, world!
        {"Hello, world!"}
         
        </>
    )
}

export default App