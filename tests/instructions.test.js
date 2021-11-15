//Unit test for main_page.ejs file 

import { fireEvent, getByText } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

const page = fs.readFileSync(path.resolve(__dirname, '../views/instructions.ejs'), 'utf8');

let dom
let container

describe('main_page.ejs', () => {
    beforeEach(() => {
      dom = new JSDOM(page, { runScripts: 'dangerously' })
      container = dom.window.document.body
    })
  
    it('renders a button element', () => {
        const button = getByText(container, 'OK')
        expect(button).toBeInTheDocument()
    })

    it('button has a green border', () => {
        const button = getByText(container, 'OK')
        expect(button).toHaveStyle('border:  3px solid #4CAF50')
    })
})