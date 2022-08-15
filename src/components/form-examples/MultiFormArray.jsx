import React, { useState, useEffect } from 'react'
import {
    useForm,
    useFieldArray,
    Controller,
    FormProvider,
} from 'react-hook-form'
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'

function MultiFormArray(props) {
    const [activeFile, setActiveFile] = useState('html')

    const {
        control,
        reset,
        register,
        resetField,
        getValues,
        handleSubmit,
        formState,
    } = useForm({
        name: 'projects',
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
    }

    return (
        <div>
            <button
                onClick={() => {
                    reset({
                        projects: [
                            ...values.projects,
                            {
                                title: '',
                                html: '',
                                css: '',
                                js: '',
                                libraries: [],
                                fonts: [{ type: 'font', url: '' }],
                                id: uuidv4(),
                            },
                        ],
                    })
                }}
            >
                append
            </button>
            <div>
                choose active file:
                <button onClick={() => setActiveFile('html')}>html</button>
                <button onClick={() => setActiveFile('css')}>css</button>
                <button onClick={() => setActiveFile('js')}>js</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {values.projects.length > 0 &&
                    values.projects.map((project, index) => {
                        return (
                            <div key={project.id}>
                                <input
                                    {...register(`projects.${index}.title`)}
                                />
                                <div>
                                    {activeFile}:
                                    {activeFile === 'html' && (
                                        <input
                                            {...register(
                                                `projects.${index}.html`
                                            )}
                                        />
                                    )}
                                    {activeFile === 'css' && (
                                        <input
                                            {...register(
                                                `projects.${index}.css`
                                            )}
                                        />
                                    )}
                                    {activeFile === 'js' && (
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
                                                values.projects[index].libraries
                                            }
                                        />
                                    </div>
                                    <div>
                                        fonts:
                                        <FormFonts
                                            register={register}
                                            control={control}
                                            index={index}
                                            resetField={resetField}
                                            values={
                                                values.projects[index].fonts
                                            }
                                        />
                                    </div>
                                </div>
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

const FormFonts = ({ register, resetField, index, values, control }) => {
    const { fields } = useFieldArray({
        name: `projects.${index}.fonts`,
        control,
    })

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
                    <input
                        key={field.id}
                        name={`projects[${index}].fonts[${fontIndex}].url`}
                        {...register(
                            `projects[${index}].fonts[${fontIndex}].url`
                        )}
                    />
                )
            })}
        </>
    )
}
