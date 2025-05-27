import Header from '../components/Header'
import BlogTabs from '../components/BlogTabs'

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <div className="max-w-6xl mx-auto">
        <BlogTabs />
      </div>
    </div>
  )
}

export default Home
