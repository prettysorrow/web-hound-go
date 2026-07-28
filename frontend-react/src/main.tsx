import './styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import WebHoundRouter from './routing/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={WebHoundRouter} />
  </StrictMode>
)
