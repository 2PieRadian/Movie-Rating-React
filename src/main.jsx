import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
// import StarRating from './StarRating'
// import Test from './Test'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <StarRating maxRating={5} size={24} color='red' />
    <StarRating maxRating={5} size={30} color='indigo' />
    <StarRating color='black'/>
    <StarRating maxRating={5} size={56} color='wheat' />
    <StarRating messages={['Worst', 'Bad', 'Good', 'Better', 'Best']} />
    <StarRating messages={['Worst', 'Bad', 'Good', 'Better', 'Best']} defaultRating={3} color='gray'/>
    <StarRating color='black' />
    <Test /> */}
  </StrictMode>,
)