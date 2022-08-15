import { createSelector } from '@reduxjs/toolkit'
import projectsAdapter from './projects-adapter'

const projectsSelector = projectsAdapter.getSelectors(
    (state) => state?.projects ?? null
)

const {
    selectIds: selectProjectIds,
    selectEntities: selectProjectEntities,
    selectAll: selectAllProjects,
} = projectsSelector

const selectActiveProjectId = (state) => state.projects.openProjectId

const selectActiveFileType = createSelector(
    [selectProjectEntities, selectActiveProjectId],
    (projects, activeProjectId) => {
        return projects?.[activeProjectId]?.activeFile || null
    }
)

export {
    selectProjectIds,
    selectProjectEntities,
    selectAllProjects,
    selectActiveProjectId,
    selectActiveFileType,
}
