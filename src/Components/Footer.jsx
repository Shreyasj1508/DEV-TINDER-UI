const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 text-white py-16 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
                  DevTinder
                </span>
                <div className="text-sm text-gray-300 -mt-1">For Developers</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              The premier platform for developers to connect, collaborate, and build amazing projects together. 
              Find your perfect coding match and take your career to the next level.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Connecting developers worldwide since 2024</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-pink-400">Quick Links</h3>
            <div className="space-y-3">
              {['About Us', 'How It Works', 'Success Stories', 'Developer Blog', 'Help Center', 'Contact'].map((link) => (
                <a key={link} href="#" className="block text-gray-300 hover:text-pink-400 transition-colors duration-200 text-sm">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-pink-400">Connect</h3>
            <div className="space-y-4">
              <a
                href="https://x.com/shreyas1508_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-pink-400 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </div>
                <span className="text-sm">Twitter</span>
              </a>

              <a
                href="https://www.linkedin.com/in/shreyas-jaiswal1508"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-pink-400 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.336-.026-3.06-1.865-3.06-1.865 0-2.152 1.458-2.152 2.965v5.699h-3v-10h2.879v1.365h.042c.401-.759 1.379-1.56 2.839-1.56 3.038 0 3.597 2 3.597 4.604v5.591z" />
                </svg>
                </div>
                <span className="text-sm">LinkedIn</span>
              </a>

              <a
                href="https://github.com/shreyasj1508"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-pink-400 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.304 3.438 9.8 8.207 11.385.6.111.793-.261.793-.577 0-.285-.011-1.04-.016-2.04-3.338.724-4.042-1.609-4.042-1.609-.546-1.387-1.333-1.757-1.333-1.757-1.091-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.235-3.221-.123-.304-.535-1.527.117-3.182 0 0 1.007-.322 3.3 1.23.957-.267 1.983-.4 3.003-.404 1.02.004 2.047.137 3.003.404 2.293-1.552 3.298-1.23 3.298-1.23.653 1.655.241 2.878.118 3.182.767.841 1.234 1.911 1.234 3.221 0 4.608-2.805 5.625-5.476 5.922.432.372.816 1.102.816 2.222 0 1.606-.014 2.896-.014 3.293 0 .319.191.694.799.576 4.766-1.588 8.202-6.081 8.202-11.382 0-6.627-5.373-12-12-12z" />
                </svg>
                </div>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} DevTinder. All rights reserved.
              </p>
              <div className="flex space-x-4 text-xs">
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Cookies</a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;