import React from "react";
import { FaReact, FaBook, FaUser, FaCog } from "react-icons/fa";
import NavigateButton from "../components/NavigateButton";
import ThemeButton from "../components/ThemeButton";

const Demo = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-primary-gradient">UI Elements Demo</h1>

      {/* Buttons Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary-gradient pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="btn-primary">Primary Button</button>
          <button className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 py-2 px-4 rounded transition-all duration-300 hover:shadow-md">
            Secondary Button
          </button>
          <NavigateButton onClick={() => alert("Navigate clicked!")}>Navigate Button</NavigateButton>
          <ThemeButton
            dark={true}
            setDark={() => {}}
          />
        </div>
      </section>

      {/* Text Styles */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary-gradient pb-2">Text Styles</h2>
        <p className="text-xl mb-2">Regular paragraph text</p>
        <p className="text-primary-gradient text-xl mb-2 font-bold">Gradient text styling</p>
        <p className="font-bold mb-2">Bold text</p>
        <p className="italic mb-2">Italic text</p>
        <p className="underline mb-2">Underlined text</p>
      </section>

      {/* Cards and Containers */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary-gradient pb-2">Cards & Containers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-gradient">
            <h3 className="text-xl font-bold mb-2">Gradient Card</h3>
            <p>This card has a gradient background using our primary colors.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-primary-gradient">
            <h3 className="text-xl font-bold mb-2 dark:text-white">Bordered Card</h3>
            <p className="dark:text-gray-200">This card has a gradient border.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-theme">
            <h3 className="text-xl font-bold mb-2 dark:text-white">Theme Border</h3>
            <p className="dark:text-gray-200">This card uses the theme border style.</p>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary-gradient pb-2">Icons</h2>
        <div className="flex flex-wrap items-center gap-8 justify-center">
          <div className="text-center">
            <div className="bg-primary-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaReact className="text-3xl text-white" />
            </div>
            <p>React</p>
          </div>

          <div className="text-center">
            <div className="bg-primary-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaBook className="text-3xl text-white" />
            </div>
            <p>Books</p>
          </div>

          <div className="text-center">
            <div className="bg-primary-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaUser className="text-3xl text-white" />
            </div>
            <p>Users</p>
          </div>

          <div className="text-center">
            <div className="bg-primary-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaCog className="text-3xl text-white" />
            </div>
            <p>Settings</p>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary-gradient pb-2">Form Elements</h2>
        <form className="space-y-4 max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label
              htmlFor="name"
              className="block mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-purple-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-2">Role</label>
            <select className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-purple-500">
              <option>User</option>
              <option>Librarian</option>
              <option>Admin</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purple-600"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Submit
          </button>
        </form>
      </section>

      {/* Image with Border */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary-gradient pb-2">Images</h2>
        <div className="flex justify-center">
          <div className="border-primary-gradient p-1 rounded-lg inline-block">
            <img
              src="/src/assets/react.svg"
              alt="React Logo"
              className="w-40 h-40 object-contain bg-white dark:bg-gray-800 rounded-lg p-2"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;
