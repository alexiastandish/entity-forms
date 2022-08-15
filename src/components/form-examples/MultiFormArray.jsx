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
    console.log('dirtyFields', dirtyFields)

    const values = getValues()
    // console.log('values', values)

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
                                        fonts:
                                        <FormFonts
                                            reset={reset}
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

const FormFonts = ({ register, reset, resetField, index, values, control }) => {
    // console.log('values', values)

    const { fields, append, remove } = useFieldArray({
        name: `projects.${index}.fonts`,
        control,
    })

    return (
        <>
            <button
                onClick={() => {
                    console.log('values', values)
                    return resetField(`projects.${index}.fonts`, {
                        defaultValue: [...values, { type: 'font', url: '' }],
                        keepDirty: true,
                        keepTouched: true,
                        keepError: true,
                    })
                    // append({ type: 'font', url: '' })
                }}
            >
                append
            </button>
            {fields.map((field, fontIndex) => {
                console.log('field', field)
                return (
                    <input
                        key={field.id}
                        // {...register(
                        //     `projects.${index}.fonts.${fontIndex}.url`,
                        //     {
                        //         onChange: (e) => {
                        //             console.log('e', e)
                        //             e.preventDefault()
                        //             return {
                        //                 type: 'font',
                        //                 url: e.target.value,
                        //             }
                        //         },
                        //     }
                        // )}
                        name={`projects[${index}].fonts[${fontIndex}].url`}
                        {...register(
                            `projects[${index}].fonts[${fontIndex}].url`
                        )}
                        // defaultValue={{ type: 'font', url: '' }}
                    />
                )
            })}
        </>
    )

    // return values.projects[0].fonts.map((font, index) => {
    //     return (
    //         <div key={fields[index].id}>
    //             <input
    //                 key={fields[index].id}
    // {...register(`projects.0.fonts.${index}.url`, {
    //     onChange: (e) => {
    //         e.preventDefault()
    //         return {
    //             type: 'font',
    //             url: e.target.value,
    //         }
    //     },
    // })}
    //             />
    //             <button onClick={remove}>x</button>
    //         </div>
    //     )
    // })
}
