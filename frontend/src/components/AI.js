import React, { useState, useEffect } from 'react';
import glass from "../static/search.gif"

const apiUrl = 'http://127.0.0.1:8000/classify/';

export default function AI() {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const callAPI = async () => {
        setLoading(true);
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                setPrediction(data.prediction);
            } else {
                console.error('Failed to fetch data:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        callAPI();
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        setLoading(true);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                setPrediction(data.prediction);
            } else {
                console.error('Failed to classify image:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-wrap py-[30px] p-[20px]">
                <div className="flex items-center w-full lg:w-1/2">
                    <div className="max-w-2xl mb-8">
                        <h1 className="text-3xl font-bold px-3 leading-snug tracking-tight text-amber-400 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
                            About WasteBot AI
                        </h1>
                        <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl p-3">
                            WasteBot AI is your personal AI assistant that helps you sort and identify different kinds of waste, such as plastic, paper, metal, cardboard, glass and trash. Just take a snap and done! To help you learn more about these different wastes and how they can be displayed, we have also included a chatbot that you can talk to in order to understand anything related to different types of waste and their disposal.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center w-full lg:w-1/2">
                    <div className="">
                        <img src={glass} style={{ width: 350 }} alt="WasteBot AI"></img>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center h-screen mt-[-350px]">
                <div className="file-uploader">
                    {/* File uploader component */}
                    <form onSubmit={handleFormSubmit} encType="multipart/form-data" className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">Select an Image (Only jpg):</label>
                            <input type="file" name="file" id="file" accept="image/jpeg" required className="border border-gray-400 p-2 w-full rounded"></input>
                        </div>
                        <div>
                            <button type="submit" disabled={loading} className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Display prediction */}
            {prediction && (
                <div className="text-center mt-4">
                    <h2 className="text-xl font-bold">Prediction:</h2>
                    <p className="text-2xl text-indigo-600">{prediction}</p>
                </div>
            )}
        </>
    );
}

