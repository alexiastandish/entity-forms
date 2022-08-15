import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import projectsReducer from '../features/projects/projects-slice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        projects: projectsReducer,
    },
})
