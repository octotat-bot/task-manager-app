import TodoList from './components/TodoList'
import CreativeHeader from './components/CreativeHeader'
import ParticleBackground from './components/ParticleBackground'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <ParticleBackground />
        <CreativeHeader />
        <main className="main-content">
          <TodoList />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
