import { createSlice } from '@reduxjs/toolkit'
import projectsAdapter from './projects-adapter'

const projectsSlice = createSlice({
    name: 'projects',
    initialState: projectsAdapter.getInitialState({
        openProjectId: '',
    }),
    reducers: {
        projectsAddOne: projectsAdapter.addOne,
    },
})

export const { projectsAddOne } = projectsSlice.actions

export default projectsSlice.reducer
