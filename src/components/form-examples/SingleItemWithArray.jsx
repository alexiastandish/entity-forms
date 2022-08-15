import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import Select from 'react-select'

function SingleItemWithArray(props) {
    const [activeFile, setActiveFile] = useState('html')
    const [selectedOptions, setSelectedOptions] = useState([])

    const [submittedValues, setSubmittedValues] = useState(null)

    const { register, control, handleSubmit, getValues, formState } = useForm({
        mode: 'onChange',
        defaultValues: {
            projects: {
                title: '',
                html: '',
                css: '',
                js: '',
                libraries: [],
                fonts: [{ type: 'font', url: '' }],
            },
        },
    })

    const { isDirty, dirtyFields } = formState

    console.log('isDirty', isDirty)
    console.log('dirtyFields', dirtyFields)

    const {
        fields: libraryFields,
        append: appendLibrary,
        remove: removeLibrary,
    } = useFieldArray({
        name: `projects.libraries`,
        control,
    })

    const { fields, append, remove } = useFieldArray({
        name: `projects.fonts`,
        control,
    })

    const values = getValues()

    const onSubmit = ({ projects }) => {
        const data = projects

        const validFonts = []
        data.fonts.map((font) => {
            if (font.url) {
                validFonts.push(font.url)
            }
        })
        const submitData = {
            title: data.title,
            files: {
                html: data.html,
                css: data.css,
                js: data.js,
            },
            libraries: data.libraries.map((lib) => lib.label),
            fonts: validFonts,
        }

        setSubmittedValues(submitData)
    }

    const handleMultiChange = (selectedOption) => {
        setSelectedOptions((prev) => {
            return [...prev, selectedOption.value]
        })
        appendLibrary(selectedOption)
    }

    const removeLib = (index) => {
        const updatedSelectedOption = [...selectedOptions]
        updatedSelectedOption.splice(index, 1)

        setSelectedOptions(updatedSelectedOption)
        return removeLibrary(index)
    }

    return (
        <>
            <div>
                choose active file:
                <button onClick={() => setActiveFile('html')}>html</button>
                <button onClick={() => setActiveFile('css')}>css</button>
                <button onClick={() => setActiveFile('js')}>js</button>
            </div>
            <h1>isDirty: {JSON.stringify(isDirty)}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register(`projects.title`)} />

                {activeFile === 'html' && (
                    <input {...register(`projects.html`)} />
                )}
                {activeFile === 'css' && (
                    <input {...register(`projects.css`)} />
                )}
                {activeFile === 'js' && <input {...register(`projects.js`)} />}

                {values.projects.libraries.length > 0 &&
                    values.projects.libraries.map((library, index) => {
                        console.log('libraryFields', libraryFields)
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

                {values.projects.fonts.map((font, index) => {
                    console.log('HERE', index, font, fields[index].id)
                    return (
                        <div key={fields[index].id}>
                            <input
                                {...register(`projects.fonts.${index}.url`, {
                                    onChange: (e) => {
                                        e.preventDefault()
                                        return {
                                            type: 'font',
                                            url: e.target.value,
                                        }
                                    },
                                })}
                                id={fields[index].id}
                                key={fields[index].id}
                            />
                            <button onClick={remove}>x</button>
                        </div>
                    )
                })}

                <button onClick={() => append({ type: 'font', url: '' })}>
                    add input
                </button>

                <input type="submit" />
            </form>
            {dirtyFields.projects && JSON.stringify(dirtyFields.projects)}
            <br />
            <div>
                Submitted Data: <br />
                {submittedValues && (
                    <div>
                        <p>
                            <span style={{ color: 'red' }}>title: </span>
                            {submittedValues.title}
                        </p>
                        <div>
                            <span style={{ color: 'red' }}> files: </span>
                            <br />
                            <p>
                                <span style={{ color: 'blue' }}>html:</span>
                                {submittedValues.files.html}
                            </p>
                            <p>
                                <span style={{ color: 'blue' }}>css:</span>
                                {submittedValues.files.css}
                            </p>
                            <p>
                                <span style={{ color: 'blue' }}>js:</span>
                                {submittedValues.files.js}
                            </p>
                        </div>
                        <div>
                            <span style={{ color: 'red' }}>libraries:</span>
                            {submittedValues.libraries.map((lib) => {
                                return <p key={lib}>{lib}</p>
                            })}
                        </div>
                        <div>
                            <span style={{ color: 'red' }}>fonts:</span>
                            {JSON.stringify(submittedValues.fonts)}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default SingleItemWithArray
