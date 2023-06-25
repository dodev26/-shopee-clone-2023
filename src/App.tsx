import { useContext, useEffect } from 'react'
import './App.css'
import { AppContext } from './contexts/app.context'
import useRouteElements from './useRouteElements'
import { LocalStorageEventTarget } from './utils/auth'

function App() {
  const routeElements = useRouteElements()
  const { isAuthenticated, reset } = useContext(AppContext)
  console.log(isAuthenticated)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => LocalStorageEventTarget.removeEventListener('clearLS', reset)
  }, [reset])

  return <div>{routeElements}</div>
}
export default App
