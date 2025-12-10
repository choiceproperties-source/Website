import React from 'react'
import Hero from '../components/Hero'
import Companies from '../components/Companies'
import Features from '../components/Features'
import FeaturedProperties from '../components/FeaturedProperties'
import OurAgents from '../components/OurAgents'
import WhyChooseUs from '../components/WhyChooseUs'
import Steps from '../components/Steps'
import Testimonials from '../components/Testimonial'
import Blog from '../components/Blog'

const Home = () => {
  return (
    <div>
      <Hero />
      <Companies />
      <FeaturedProperties />
      <OurAgents />
      <WhyChooseUs />
      <Features />
      <Steps />
      <Testimonials />
      <Blog />
    </div>
  )
}

export default Home
