import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { testPages } from '../config/navigationItems'
import { throwTestError } from '../utils/errorTesting'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = useCallback((e, item) => {
    if (item.testError) {
      e.preventDefault()
      throwTestError()
    }
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
      >
        Test Pages ▼
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {testPages.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={(e) => handleClick(e, item)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}