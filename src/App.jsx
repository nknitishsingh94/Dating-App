import { useState, useRef, useEffect } from 'react'
import { Heart, Upload, Coffee, MapPin, CalendarHeart, Utensils, Sparkles, Car, Phone, Navigation } from 'lucide-react'

function App() {
  const [step, setStep] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: 0, left: 0, absolute: false });
  const noButtonRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const [formData, setFormData] = useState({
    picture: null,
    favoriteFood: '',
    favoriteDrink: '',
    freeDate: '',
    dateType: '',
    favoriteCafe: '',
    location: '',
    pickupLocation: '',
    phoneNumber: ''
  });

  const dateTypeOptions = ["Movie Date 🍿", "Candlelight Dinner 🕯️", "Amusement Park 🎢", "Picnic 🧺", "Long Drive 🚗", "Arcade 🎮"];
  const foodOptions = ["Pizza 🍕", "Sushi 🍣", "Pasta 🍝", "Burgers 🍔", "Chinese 🍜", "Mexican 🌮"];
  const drinkOptions = ["Coffee ☕", "Boba 🧋", "Wine 🍷", "Cocktails 🍹", "Matcha 🍵", "Smoothies 🥤"];

  const handleHoverNo = () => {
    if (!noButtonRef.current) return;
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    setNoButtonPosition({ top: y, left: x, absolute: true });
  };

  const handleNext = () => setStep(prev => prev + 1);

  const handleFinish = async () => {
    setIsUploading(true);
    let imageUrl = '';

    if (formData.picture) {
      try {
        const uploadData = new FormData();
        uploadData.append('file', formData.picture);
        
        const response = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: uploadData,
        });
        
        const data = await response.json();
        if (data.status === 'success') {
          imageUrl = data.data.url;
        }
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }

    const text = `Hey! It's a Date! 🎉\n\n` +
      `*Date & Time:* ${formData.freeDate ? new Date(formData.freeDate).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'TBD'}\n` +
      `*Vibe:* ${formData.dateType}\n` +
      `*Menu:* ${formData.favoriteFood} & ${formData.favoriteDrink}\n` +
      `*Pickup At:* ${formData.pickupLocation}\n` +
      `*Destination:* ${formData.favoriteCafe}, ${formData.location}\n` +
      `*Phone Number:* ${formData.phoneNumber}\n\n` +
      (imageUrl ? `*Photo:* ${imageUrl}\n\n` : '') +
      `Can't wait! 😘`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/919682847333?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
    setIsUploading(false);
    handleNext();
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const address = data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
            setFormData(prev => ({ ...prev, pickupLocation: address }));
          } catch (error) {
            setFormData(prev => ({ ...prev, pickupLocation: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}` }));
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error(error);
          setIsLocating(false);
          alert("Couldn't get your location automatically. Please type it in.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    if (!formData.freeDate) {
      setTimeLeft('');
      return;
    }
    
    const targetDate = new Date(formData.freeDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        setTimeLeft("It's Time! 🎉");
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      timeString += `${hours}h ${minutes}m ${seconds}s`;
      setTimeLeft(timeString);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [formData.freeDate]);

  return (
    <>
      <div className="hearts-bg">
        {[...Array(40)].map((_, i) => (
          <Heart 
            key={i} 
            className="heart-bubble" 
            size={Math.random() * 25 + 10} 
            style={{ 
              left: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 4}s`
            }} 
            fill="currentColor" 
            strokeWidth={0}
          />
        ))}
      </div>

      <div className="glass-container">
        {step === 0 && (
          <div>
            <h1>You're Invited! ✨</h1>
            <h2>To Become Ashvani Sharma's Date 🌹</h2>
            <p className="sweet-note">Congratulations! You've been exclusively chosen for this special moment. Get ready for an unforgettable journey... Are you ready? 🥰</p>
            <button className="btn" onClick={handleNext}>Yes, Let's go! 🚀</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1>Will you go on a date with me? 🥺</h1>
            <p className="sweet-note">I've been waiting for the perfect moment to ask you this. You make my heart smile, and I promise to make this the best date ever! 💕</p>
            <div className="button-group">
              <button className="btn" onClick={handleNext}>Yes! ❤️</button>
              <button 
                ref={noButtonRef}
                className={`btn btn-secondary ${noButtonPosition.absolute ? 'runaway' : ''}`}
                style={noButtonPosition.absolute ? { position: 'fixed', left: noButtonPosition.left, top: noButtonPosition.top } : {}}
                onMouseEnter={handleHoverNo}
                onTouchStart={handleHoverNo}
                onClick={handleHoverNo}
              >
                No 😢
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>Yay! First, show me your beautiful face 📸</h2>
            <p className="sweet-note">Just so I can stare at it while I plan everything perfectly. Your smile is my absolute favorite thing in the world. 😍</p>
            <div className="input-group">
              <label><Upload size={16} style={{display:'inline', marginRight:'8px'}}/> Upload a cute picture of you</label>
              <input type="file" name="picture" accept="image/*" onChange={handleInputChange} />
            </div>
            {formData.picture && <p style={{fontSize: '0.9rem', color: '#4ade80'}}>Picture attached!</p>}
            <button className="btn" onClick={handleNext} disabled={!formData.picture}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2>When are you free? 📅</h2>
            <p className="sweet-note">I'm counting down the seconds until I can see you. Let me know when you're free, and I'll clear my entire schedule just for you. ⏳❤️</p>
            <div className="input-group">
              <label><CalendarHeart size={16} style={{display:'inline', marginRight:'8px'}}/> Select Date & Time</label>
              <input type="datetime-local" name="freeDate" value={formData.freeDate} onChange={handleInputChange} />
              {timeLeft && <div style={{marginTop: '12px', fontSize: '1.2rem', color: '#d6336c', fontWeight: 'bold', textAlign: 'center'}}>⏳ {timeLeft}</div>}
            </div>
            <button className="btn" onClick={handleNext} disabled={!formData.freeDate}>Next</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2>What kind of date would you like? ✨</h2>
            <p className="sweet-note">I want to make sure it's the perfect vibe for us! Let me know what you're in the mood for. 🥰</p>
            <div className="input-group">
              <label><Sparkles size={16} style={{display:'inline', marginRight:'8px'}}/> Pick the vibe</label>
              <div className="options-grid">
                {dateTypeOptions.map(type => (
                  <button 
                    key={type} 
                    className={`option-btn ${formData.dateType === type ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({...prev, dateType: type}))}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <input type="text" name="dateType" value={formData.dateType} onChange={handleInputChange} placeholder="Or type your own vibe..." style={{marginTop: '10px'}} />
            </div>
            <button className="btn" onClick={handleNext} disabled={!formData.dateType}>Next</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2>Awesome! What's on the menu? 😋</h2>
            <p className="sweet-note">I want to treat you to your absolute favorites. Because a queen deserves nothing less than exactly what she craves! 🍽️✨</p>
            <div className="input-group">
              <label><Utensils size={16} style={{display:'inline', marginRight:'8px'}}/> Pick your favorite food</label>
              <div className="options-grid">
                {foodOptions.map(food => (
                  <button 
                    key={food} 
                    className={`option-btn ${formData.favoriteFood === food ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({...prev, favoriteFood: food}))}
                  >
                    {food}
                  </button>
                ))}
              </div>
              <input type="text" name="favoriteFood" value={formData.favoriteFood} onChange={handleInputChange} placeholder="Or type something else..." style={{marginTop: '10px'}} />
            </div>
            <div className="input-group">
              <label><Coffee size={16} style={{display:'inline', marginRight:'8px'}}/> Pick your favorite drink</label>
              <div className="options-grid">
                {drinkOptions.map(drink => (
                  <button 
                    key={drink} 
                    className={`option-btn ${formData.favoriteDrink === drink ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({...prev, favoriteDrink: drink}))}
                  >
                    {drink}
                  </button>
                ))}
              </div>
              <input type="text" name="favoriteDrink" value={formData.favoriteDrink} onChange={handleInputChange} placeholder="Or type something else..." style={{marginTop: '10px'}} />
            </div>
            <button className="btn" onClick={handleNext} disabled={!formData.favoriteFood || !formData.favoriteDrink}>Next</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2>Where are we going? 🗺️</h2>
            <p className="sweet-note">Whether it's a cozy cafe or a magical spot under the stars, any place is beautiful as long as I'm there with you. 🌌🚗</p>
            <div className="input-group">
              <label><Coffee size={16} style={{display:'inline', marginRight:'8px'}}/> Favorite Cafe / Spot</label>
              <input type="text" name="favoriteCafe" value={formData.favoriteCafe} onChange={handleInputChange} placeholder="e.g., Central Perk..." />
            </div>
            <div className="input-group">
              <label><MapPin size={16} style={{display:'inline', marginRight:'8px'}}/> Area / Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Downtown..." />
            </div>
            <div className="input-group">
              <label><Car size={16} style={{display:'inline', marginRight:'8px'}}/> Pickup Location</label>
              <div style={{display: 'flex', gap: '8px'}}>
                <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} placeholder="Type or use Live Location" />
                <button type="button" className="btn btn-secondary" style={{padding: '12px', borderRadius: '14px', minWidth: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={handleGetLocation} disabled={isLocating} title="Get Live Location">
                  {isLocating ? <span style={{fontSize: '0.8rem'}}>...</span> : <Navigation size={20} />}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label><Phone size={16} style={{display:'inline', marginRight:'8px'}}/> Phone Number</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="For coordination..." />
            </div>
            <button className="btn" onClick={handleFinish} disabled={!formData.favoriteCafe || !formData.location || !formData.pickupLocation || !formData.phoneNumber || isUploading}>
              {isUploading ? 'Preparing... ⏳' : 'Finish 💖'}
            </button>
          </div>
        )}

        {step === 7 && (
          <>
            <div className="celebration-container">
              {[...Array(120)].map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 500 + 100; // Explode outwards between 100px and 600px
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                return (
                  <div 
                    key={i} 
                    className="firework-particle" 
                    style={{
                      '--tx': `${tx}px`,
                      '--ty': `${ty}px`,
                      animationDuration: `${Math.random() * 1.5 + 1}s`,
                      animationDelay: `${Math.random() * 0.2}s`,
                      fontSize: `${Math.random() * 25 + 15}px`
                    }}
                  >
                    {['❤️', '💋', '🎉', '🎇', '🎆', '✨', '💕'][Math.floor(Math.random() * 7)]}
                  </div>
                );
              })}
            </div>
            <div className="success-card">
            <div className="couple-animation">
              <span className="boy">👦🏻</span>
              <Heart className="center-heart" size={60} fill="currentColor" strokeWidth={0} />
              <span className="girl">👧🏻</span>
            </div>
            <h1 className="success-title">It's a Date! 🎉</h1>
            <p className="success-subtitle sweet-note" style={{marginBottom: '20px'}}>It's officially on! Get ready for a day full of laughter, butterflies, and unforgettable memories. I can't wait! 🥰</p>
            
            <div className="date-pass">
              <div className="pass-header">
                <h3>VIP DATE PASS 💌</h3>
              </div>
              <div className="pass-body">
                <div className="pass-row">
                  <div className="pass-label">Date & Time</div>
                  <div className="pass-value">{formData.freeDate ? new Date(formData.freeDate).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}</div>
                </div>
                <div className="pass-row">
                  <div className="pass-label">Time Remaining</div>
                  <div className="pass-value countdown-highlight">{timeLeft}</div>
                </div>
                <div className="pass-row">
                  <div className="pass-label">Vibe</div>
                  <div className="pass-value">{formData.dateType}</div>
                </div>
                <div className="pass-row">
                  <div className="pass-label">Menu</div>
                  <div className="pass-value">{formData.favoriteFood} & {formData.favoriteDrink}</div>
                </div>
                <div className="pass-row">
                  <div className="pass-label">Pickup At</div>
                  <div className="pass-value">{formData.pickupLocation}</div>
                </div>
                <div className="pass-row">
                  <div className="pass-label">Destination</div>
                  <div className="pass-value">{formData.favoriteCafe}, {formData.location}</div>
                </div>
              </div>
              <div className="pass-footer">
                <p>Can't wait to see you! 😘</p>
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
