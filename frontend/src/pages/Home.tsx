import React, { Suspense, lazy } from 'react';
import Hero from '../components/Hero';

const UniqueNeeds = lazy(() => import('../components/UniqueNeeds'));
const YogaTypes = lazy(() => import('../components/YogaTypes'));
const AboutUsSection = lazy(() => import('../components/AboutUsSection'));
const IndividualClasses = lazy(() => import('../components/IndividualClasses'));
const GroupClasses = lazy(() => import('../components/GroupClasses'));
const Programs = lazy(() => import('../components/Programs'));
const GalleryLibrary = lazy(() => import('../components/GalleryLibrary'));
const WorkoutStats = lazy(() => import('../components/WorkoutStats'));
const ScheduleCTA = lazy(() => import('../components/ScheduleCTA'));
const GlobalSchedule = lazy(() => import('../components/GlobalSchedule'));
const LiveFitTestimonials = lazy(() => import('../components/LiveFitTestimonials'));

const Home = () => {
  return (
    <>
      <div id="hero">
        <Hero />
      </div>
      <Suspense fallback={null}>
        <div id="unique-needs">
          <UniqueNeeds />
        </div>
        <YogaTypes />
        <div id="our-story">
          <AboutUsSection />
        </div>
        <div id="one-on-one-coaching">
          <IndividualClasses />
        </div>
        <div id="live-group-zoom">
          <GroupClasses />
        </div>
        <div id="wellness-programs">
          <Programs />
        </div>
        <div id="schedule">
          <GlobalSchedule />
        </div>
        <ScheduleCTA />
        <WorkoutStats />
        <div id="gallery">
          <GalleryLibrary />
        </div>
        <div id="testimonials">
          <LiveFitTestimonials />
        </div>
      </Suspense>
    </>
  );
};

export default Home;
