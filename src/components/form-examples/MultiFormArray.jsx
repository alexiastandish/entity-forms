import React, { useState, useEffect } from 'react'
import {
    useForm,
    useFieldArray,
    useFormContext,
    useWatch,
} from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'
import {
    projectsAddOne,
    setOpenProjectId,
    setActiveFile as setActiveFileTest,
} from '../../features/projects/projects-slice'
import {
    selectProjectEntities,
    selectActiveFileType,
    selectActiveProjectId,
    selectAllProjects,
} from '../../features/projects/projects-selectors'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

function MultiFormArray(props) {
    const openProjectId = useSelector(selectActiveProjectId)
    const projects = useSelector(selectProjectEntities)
    const projectTabs = useSelector(selectAllProjects)
    const activeFileType = useSelector(selectActiveFileType)

    const setActiveFileType = (type) => {
        dispatch(
            setActiveFileTest({
                id: openProjectId,
                changes: { ...projects[openProjectId], activeFile: type },
            })
        )
    }

    const dispatch = useDispatch()

    const {
        control,
        reset,
        register,
        resetField,
        getValues,
        watch,
        handleSubmit,
        formState,
        unregister,
    } = useForm({
        name: 'projects',
        mode: 'onChange',
        defaultValues: {
            projects: [],
        },
    })

    const { isDirty, dirtyFields } = formState

    console.log('isDirty', isDirty)
    console.log('dirtyFields', dirtyFields)

    const values = getValues()

    const onSubmit = (data) => {
        console.log('data', data)
        // reset({ projects: data.projects })
    }

    const handleSelectTab = (_, id) => {
        dispatch(setOpenProjectId(id))
    }

    return (
        <div>
            <button
                onClick={() => {
                    const id = uuidv4()
                    dispatch(
                        projectsAddOne({
                            activeFile: 'html',
                            id,
                            customBlockId: null,
                        })
                    )
                    dispatch(setOpenProjectId(id))
                    reset(
                        {
                            projects: [
                                ...values.projects,
                                {
                                    title: '',
                                    html: '',
                                    css: '',
                                    js: '',
                                    libraries: [],
                                    fonts: [{ type: 'font', url: '' }],
                                    id,
                                },
                            ],
                        },
                        {
                            keepErrors: true,
                            keepDirty: true,
                            keepTouched: true,
                        }
                    )
                }}
            >
                append
            </button>
            <div>
                choose active file:
                <button onClick={() => setActiveFileType('html')}>html</button>
                <button onClick={() => setActiveFileType('css')}>css</button>
                <button onClick={() => setActiveFileType('js')}>js</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {values.projects.length > 0 &&
                    values.projects.map((project, index) => {
                        return (
                            <div key={project.id}>
                                <Box
                                    sx={{
                                        width: 300,
                                        height: 300,
                                        backgroundColor: 'primary.dark',
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                            opacity: [0.9, 0.8, 0.7],
                                        },
                                    }}
                                >
                                    <div>
                                        title:
                                        <input
                                            {...register(
                                                `projects.${index}.title`
                                            )}
                                        />
                                    </div>

                                    <div>
                                        {activeFileType}:
                                        {activeFileType === 'html' && (
                                            <input
                                                {...register(
                                                    `projects.${index}.html`
                                                )}
                                            />
                                        )}
                                        {activeFileType === 'css' && (
                                            <input
                                                {...register(
                                                    `projects.${index}.css`
                                                )}
                                            />
                                        )}
                                        {activeFileType === 'js' && (
                                            <input
                                                {...register(
                                                    `projects.${index}.js`
                                                )}
                                            />
                                        )}
                                        <div>
                                            libraries:
                                            <FormLibraries
                                                register={register}
                                                control={control}
                                                index={index}
                                                resetField={resetField}
                                                values={
                                                    values.projects[index]
                                                        .libraries
                                                }
                                            />
                                        </div>
                                        <div>
                                            fonts:
                                            <FormFonts
                                                watch={watch}
                                                register={register}
                                                control={control}
                                                index={index}
                                                resetField={resetField}
                                                unregister={unregister}
                                                values={
                                                    values.projects[index].fonts
                                                }
                                            />
                                        </div>
                                    </div>
                                    <br />
                                    <br />
                                </Box>
                            </div>
                        )
                    })}

                <input type="submit" />
            </form>
        </div>
    )
}
export default MultiFormArray

const FormLibraries = ({ register, resetField, index, values, control }) => {
    const [selectedOptions, setSelectedOptions] = useState([])

    const { append, remove } = useFieldArray({
        name: `projects.${index}.libraries`,
        control,
    })

    const handleMultiChange = (selectedOption) => {
        setSelectedOptions((prev) => {
            return [...prev, selectedOption.value]
        })
        append(selectedOption)
    }

    const removeLib = (index) => {
        const updatedSelectedOption = [...selectedOptions]
        updatedSelectedOption.splice(index, 1)

        setSelectedOptions(updatedSelectedOption)
        return remove(index)
    }

    return (
        <>
            {values.length > 0 &&
                values.map((library, index) => {
                    return (
                        <span key={library.label}>
                            {library.label}
                            <button
                                onClick={() => {
                                    removeLib(index)
                                }}
                            >
                                x
                            </button>
                        </span>
                    )
                })}

            <Select
                options={[
                    { label: 'a', value: 'a' },
                    { label: 'b', value: 'b' },
                    { label: 'c', value: 'c' },
                ].filter((option) => {
                    return !selectedOptions.includes(option.value)
                })}
                onChange={handleMultiChange}
            />
        </>
    )
}

const FormFonts = ({
    register,
    unregister,
    resetField,
    index,
    values,
    control,
    watch,
}) => {
    const { fields, remove } = useFieldArray({
        name: `projects.${index}.fonts`,
        control,
    })
    console.log('fields', fields)
    return (
        <>
            <button
                onClick={() => {
                    return resetField(`projects.${index}.fonts`, {
                        defaultValue: [...values, { type: 'font', url: '' }],
                        keepDirty: true,
                        keepTouched: true,
                        keepError: true,
                    })
                }}
            >
                append
            </button>

            {fields.map((field, fontIndex) => {
                return (
                    <div key={field.id}>
                        <input
                            key={field.id}
                            name={`projects.${index}.fonts.${fontIndex}.url`}
                            {...register(
                                `projects.${index}.fonts.${fontIndex}.url`
                            )}
                        />
                        <button
                            onClick={() => {
                                if (fontIndex === 0) {
                                    return resetField(
                                        `projects.${index}.fonts`,
                                        {
                                            defaultValue: [
                                                { type: 'font', url: '' },
                                            ],
                                            keepDirty: true,
                                            keepTouched: true,
                                            keepError: true,
                                        }
                                    )
                                }
                                unregister(
                                    `projects.${index}.fonts.${fontIndex}.url`
                                )
                                return remove(fontIndex)
                            }}
                        >
                            x
                        </button>
                    </div>
                )
            })}
        </>
    )
}
