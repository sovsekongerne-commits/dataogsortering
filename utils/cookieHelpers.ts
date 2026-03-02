export const SPIL_NAVN = 'datasortering';

export function gemMedalje(spilNavn: string, titel: string, beskrivelse: string) {
  const medaljeData = {
    spilNavn,
    titel,
    beskrivelse,
    dato: new Date().toISOString() // Optional: good for debugging/tracking
  };

  const jsonStr = JSON.stringify(medaljeData);
  const encodedStr = encodeURIComponent(jsonStr);
  
  // Cookie settings: domain=.kongskole.dk, path=/, max-age=31536000 (1 year)
  // Note: This cookie will only be set if the current domain matches .kongskole.dk (or subdomains)
  document.cookie = `medalje_${spilNavn}=${encodedStr}; domain=.kongskole.dk; path=/; max-age=31536000; SameSite=None; Secure`;
  
  console.log(`Forsøgte at gemme medalje: ${titel} for spil: ${spilNavn}`);
}

export function gemPoint(nyePoint: number, spilNavn: string = SPIL_NAVN) {
  const cookieName = `point_${spilNavn}`;
  let currentPoints = 0;
  
  // Helper to get cookie by name
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const existingCookie = getCookie(cookieName);
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  if (existingCookie) {
    try {
      const decodedStr = decodeURIComponent(existingCookie);
      const data = JSON.parse(decodedStr);
      
      if (data.dato === todayStr) {
        currentPoints = data.point;
      } else {
        // Different date, reset points for the new day calculation (starts at 0 + new)
        currentPoints = 0;
      }
    } catch (e) {
      console.error("Fejl ved læsning af point cookie:", e);
      currentPoints = 0;
    }
  }

  const totalPoints = currentPoints + nyePoint;
  
  const pointData = {
    dato: todayStr,
    point: totalPoints
  };

  const encodedData = encodeURIComponent(JSON.stringify(pointData));
  
  // Cookie settings: domain=.kongskole.dk, path=/, max-age=86400 (24 hours)
  document.cookie = `${cookieName}=${encodedData}; domain=.kongskole.dk; path=/; max-age=86400; SameSite=None; Secure`;
  
  console.log(`Gemte point: ${totalPoints} (tilføjede ${nyePoint}) for dato: ${todayStr}`);
}
