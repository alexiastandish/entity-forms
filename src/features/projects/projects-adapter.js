import { createEntityAdapter } from '@reduxjs/toolkit'

const projectsAdapter = createEntityAdapter({
    selectId: (block) => block.customBlockId || block.id,
})

export default projectsAdapter
