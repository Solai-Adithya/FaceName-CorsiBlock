//Unit test for main_page.ejs file 

import { fireEvent, getByText } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'



const page = fs.readFileSync(path.resolve(__dirname, '../views/main_page.ejs'), 'utf8');

let dom
let container

describe('main_page.ejs', () => {
    beforeEach(() => {
      dom = new JSDOM(page, { runScripts: 'dangerously' })
      container = dom.window.document.body
    })
  
    it('renders a heading element', () => {
      expect(container.querySelector('h1')).not.toBeNull()
      expect(getByText(container, 'Memory Assessment Tasks')).toBeInTheDocument()
    })

    it('renders a button element', () => {
      const button = container.querySelector('button')
      expect(button).not.toBeNull()
      expect(getByText(container, 'Corsi Block Tapping Task')).toBeInTheDocument()
      expect(getByText(container, 'Face Memory Association Task')).toBeInTheDocument()
    })

    it('button has the expected text', () => {
      expect(getByText(container, 'Corsi Block Tapping Task')).toBeInTheDocument()
      expect(getByText(container, 'Face Memory Association Task')).toBeInTheDocument()
    })
})