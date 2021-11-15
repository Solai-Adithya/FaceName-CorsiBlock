//Unit test for displayFaces.ejs file 

import { fireEvent, getByText } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

const page = fs.readFileSync(path.resolve(__dirname, '../views/displayFaces.ejs'), 'utf8');

let dom
let container

describe('main_page.ejs', () => {
    beforeEach(() => {
      dom = new JSDOM(page, { runScripts: 'dangerously', images: ['male1.jpg', 'male2.jpg', 'male3.jpg', 'male4.jpg'] })
      container = dom.window.document.body
    })
  
    it('renders a heading element', () => {
      const heading = container.querySelectorAll('h2')
      expect(heading[0]).toBeInTheDocument()
      expect(heading.length).toBe(1)
    })

    it('renders four image components', () => {
      const images = container.querySelectorAll('img')
      expect(images.length).toBe(4)
    })
})