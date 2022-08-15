import { createSlice } from '@reduxjs/toolkit'
import projectsAdapter from './projects-adapter'

const projectsSlice = createSlice({
    name: 'projects',
    initialState: projectsAdapter.getInitialState({
        openProjectId: '',
    }),
    reducers: {
        setOpenProjectId: (state, action) => {
            state.openProjectId = action.payload
        },
        setActiveFile: (state, action) => {
            return projectsAdapter.updateOne(state, action.payload)
        },
        projectsAddOne: (state, action) => {
            return projectsAdapter.addOne(state, action.payload)
        },
    },
})

export const { setOpenProjectId, projectsAddOne, setActiveFile } =
    projectsSlice.actions

export default projectsSlice.reducer
