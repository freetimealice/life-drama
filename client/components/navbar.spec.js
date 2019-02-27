import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {Navbar} from './navbar'
//import { Link } from 'react-router';

const adapter = new Adapter()
enzyme.configure({adapter})

describe('Navbar', () => {
  let navbar

  beforeEach(() => {
    navbar = shallow(<Navbar />)
  })

  it('links to the login page', () => {
    //     expect(navbar.find('href')).to.be.equal('/login')
    expect(navbar.find(`a[href='/login']`)).to.be.present()
  })

  it('links to the sign-up page', () => {
    expect(navbar.find('href')).to.be.equal('/signup')
  })

  it("links to all the products if you aren't signed in", () => {
    expect(navbar.find('href').text()).to.be.equal('/')

  it('contains three Links', () => {
    expect(navbar.find('Link').length).to.be.equal(3)
  })

  it('links to all the products', () => {
    const allLinks = navbar.find('Link')
    expect(allLinks.at(0).prop('to')).to.be.equal('/')
  })

  it('links to the login page', () => {
    const allLinks = navbar.find('Link')
    expect(allLinks.at(1).prop('to')).to.be.equal('/login')
  })

  it('links to the sign-up page', () => {
    const allLinks = navbar.find('Link')
    expect(allLinks.at(2).prop('to')).to.be.equal('/signup')
  })

  it('links to the checkout page', () => {
    const allLinks = navbar.find('Link')
    expect(allLinks.at(3).prop('to')).to.be.equal('/checkout')

  })
})