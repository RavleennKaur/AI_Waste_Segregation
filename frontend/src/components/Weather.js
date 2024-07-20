import React from 'react'
import ladki from "../static/ladki.jpg"
import ladka from "../static/giphy.gif"
import akshaj from "../static/akshaj.jpg"
import gurmann from "../static/gur.jpg"
import aradhya from "../static/aradhya.jpg"
import akshay from "../static/akshay.jpg"
import { Link } from 'react-router-dom';


export default function Weather() {
    return (
            <>
            <br></br>
            <div className="flex flex-wrap py-[30px] p-[20px] ">
              <div className="flex items-center w-full lg:w-1/2 ">
                <div className="max-w-2xl mb-8">
                  <h1 className="text-3xl font-bold px-3 leading-snug tracking-tight text-amber-400 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight ">
                    About WasteBot AI
                  </h1>
                  <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl p-3">
                  WasteBot AI is your personal AI assistant that helps you sort and identify different kinds of waste, such as plastic, paper, metal, cardboard, glass and trash. Just take a snap and done! To help you learn more about these different wastes and how they can be displayed, we have also included a chatbot that you can talk to in order to understand anything related to different types of waste and their disposal.
                  </p>
        
                  <div className="flex flex-col items-starts space-y-10 px-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
                  <Link to="http://localhost:8501">
                      <div className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md ">
                      Try It!</div>
                      </Link>
                    
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-full lg:w-1/2">
                <div className="">
                  <img src={ladka}></img>
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col justify-center">
                <div className="text-md text-center text-gray-700 ">
                  The Results shown may not be accurate <span className="text-indigo-600">always</span>{" "}
                </div>
                </div>
              </div>
              <br></br>
              <div className="flex flex-wrap justify-center">
          <div class="bg-white py-24 sm:py-32">
  <div class="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
    <div class="max-w-2xl">
      <h2 class="text-3xl font-bold px-3 leading-snug tracking-tight text-amber-400 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight ">Meet our leadership</h2>
      <p class="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl p-3">We are four sophomore ECE students at UofT with a passion to make a change in the world using technology.</p>
    </div>
    <ul role="list" class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
      <li>
        <div class="flex items-center gap-x-6">
          <img class="h-64 w-64 rounded-full" src={akshaj} alt=""></img>
          <div>
            <h2 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Akshaj Rakhecha</h2>
            <p class="text-sm font-semibold leading-6 text-indigo-600">Back End / API Developer</p>
          </div>
        </div>
      </li>
      <li>
        <div class="flex items-center gap-x-6">
          <img class="h-64 w-64 rounded-full" src={gurmann} alt=""></img>
          <div>
            <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Gurmann Singh Jaggi</h3>
            <p class="text-sm font-semibold leading-6 text-indigo-600">Front End Developer</p>
          </div>
        </div>
      </li>
      <li>
        <div class="flex items-center gap-x-6">
          <img class="h-64 w-64 rounded-full" src={aradhya} alt=""></img>
          <div>
            <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Aradhya Dang</h3>
            <p class="text-sm font-semibold leading-6 text-indigo-600">Blockchain Developer</p>
          </div>
        </div>
      </li>
      <li>
        <div class="flex items-center gap-x-6">
          <img class="h-64 w-64 rounded-full" src={akshay} alt=""></img>
          <div>
            <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Akshay Ravikumar</h3>
            <p class="text-sm font-semibold leading-6 text-indigo-600">AI / Chatbot Developer</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
        </div>
        
          </>
    );
}