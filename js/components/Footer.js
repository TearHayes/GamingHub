function Footer() {
  try {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer data-name="footer" className="py-8 border-t dark:border-gray-800 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0" data-name="footer-logo">
              <a href="/" className="text-xl font-bold flex items-center">
                <i className="fas fa-gamepad mr-2"></i>
                GamingHub
              </a>
              <p className="text-sm mt-1 opacity-70" data-name="footer-tagline">
                Premium game enhancements for the gaming community
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8" data-name="footer-links">
              <div>
                <h3 className="font-semibold mb-2" data-name="footer-links-title">Links</h3>
                <ul className="space-y-1">
                  <li data-name="footer-home-link">
                    <a href="/" className="text-sm hover:underline">Home</a>
                  </li>
                  <li data-name="footer-discover-link">
                    <a href="/discover" className="text-sm hover:underline">Discover</a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2" data-name="footer-categories-title">Categories</h3>
                <ul className="space-y-1">
                  <li data-name="footer-valorant-link">
                    <a href="/discover?category=valorant" className="text-sm hover:underline">Valorant</a>
                  </li>
                  <li data-name="footer-fortnite-link">
                    <a href="/discover?category=fortnite" className="text-sm hover:underline">Fortnite</a>
                  </li>
                  <li data-name="footer-cs-link">
                    <a href="/discover?category=counter%20strike" className="text-sm hover:underline">Counter Strike</a>
                  </li>
                  <li data-name="footer-more-link">
                    <a href="/discover" className="text-sm hover:underline">More...</a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2" data-name="footer-social-title">Social</h3>
                <ul className="space-y-1">
                  <li data-name="footer-discord-link">
                    <a 
                      href="https://discord.gg/your-server-id" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm hover:underline flex items-center"
                    >
                      <i className="fab fa-discord mr-1"></i> Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t dark:border-gray-800 mt-8 pt-4 text-center text-sm opacity-70" data-name="footer-copyright">
            <p>© {currentYear} GamingHub. All rights reserved.</p>
            <p className="mt-1">This website is for educational purposes only.</p>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    reportError(error);
    return null;
  }
}
