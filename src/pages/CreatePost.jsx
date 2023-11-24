import React, { useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { Loader, FormField } from '../components'

const CreatePost = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: ''
    })

    const [generatingImg, setGeneratingImg] = useState(false)
    const [loading, setLoading] = useState(false)

    const generateImage = async () => {
        if (form.prompt) {
            try {
                setGeneratingImg(true);
                const response = await fetch('https://raspberry-donkey-tutu.cyclic.app/api/v1/xl', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: form.prompt }),
                });

                if (!response.ok) {
                    console.log(response)

                    throw new Error(`HTTP error! Status: ${response.status}`);

                }
                console.log(response)
                const data = await response.json();
                console.log(data)
                setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
            } catch (error) {
                console.error('Fetch error:', error); // Log the specific error to the console
                alert('Failed to fetch data. Please check console for more details.'); // Show a general error message
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert('Please enter a prompt!!');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.prompt && form.photo) {
            setLoading(true);
            try {
                const response = await fetch('https://raspberry-donkey-tutu.cyclic.app/api/v1/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...form }),
                });

                await response.json();
                alert('Success');
                navigate('/');
            } catch (err) {
                alert(err);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please generate an image with proper details');
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })

    }

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt)
        setForm({ ...form, prompt: randomPrompt })

    }

    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extrabold text-[#222382] text-[32px]'>Create</h1>
                <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Create imaginitive and visually stunning images through 8XL-AI, then enjoy sharing with the community</p>
            </div>

            <form className='mt-16 onSubmit-{handleSubmit}'>
                <div className='flex flex-col gap-5'>
                    <FormField
                        LabelName="Your name"
                        type="text"
                        name="name"
                        placeholder="Saloni Singh"
                        value={form.name}
                        handleChange={handleChange}
                    />
                    <FormField
                        LabelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder='3D render of a cute tropical fish in an aquarium on a dark blue background, digital art'
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />
                    <div
                        className='relative bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 foucs:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
                        {form.photo ? (
                            <img
                                src={form.photo}
                                alt={form.prompt}
                                className='w-full h-full object-contain'
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="preview"
                                className='w-9/12 h-9/12 object-contain opacity-40'
                            />
                        )}

                        {generatingImg && (
                            <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0, 0, 0, 0.5)] rounded-lg'>
                                <Loader />
                            </div>

                        )}
                    </div>
                </div>
                <div className='mt-5 flex gap-5'>
                    <button
                        type='button'
                        onClick={generateImage}
                        className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
                        {generatingImg ? 'Generating....' : 'Generate'}
                    </button>
                </div>
                <div className='mt-10'>
                    <p className='mt-2 text-[#666e75] text-[14px]'>Once your image is created, let's share with the community!</p>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
                    >
                        {loading ? 'Sharing....' : 'Share with the Community'}
                    </button>
                </div>
            </form>

        </section>
    )
}

export default CreatePost