// Mock data matching the Home page design
export const mockInstructors = [
  {
    id: '1',
    name: 'Olivia Chen',
    specialty: 'Yoga Teacher',
    rating: 4.8,
    bio: 'Experienced yoga instructor with over 10 years of teaching experience. Specializing in Vinyasa and Hatha yoga styles.',
    categories: ['Yoga'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTQzB9VtmK-IaOUQF6ZSH22GLj9G8Lf7fxNbHl2_vECdqA0Q9ScqxEUvHr4pfRkKWD6mpAbtvexfi-KiMZVOOg_qOqaOl8k7oDhvRNAP7XyDkQqYhu1Dwwerfe7ESKONwwvLdcsgTaIGopVNgH6zPNrJ21h5hvkMjCWw7egY5CY8GWF6P79ZL8vM2J98O8SjMErSgDLdPdYILjQArhqlmxWRG5vN9kkNcGVNAPWhKdpAtgUwwTGZU659jIpVsn1Gyv9I-lQAeIyZk',
  },
  {
    id: '2',
    name: 'Ben Carter',
    specialty: 'HIIT Specialist',
    rating: 4.2,
    bio: 'Dynamic HIIT instructor passionate about high-intensity training. Former athlete with 8 years of coaching experience.',
    categories: ['HIIT'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNzrASTlgpRh0hF7Uhi9lytQC1IBxFKLkKiTOv0oqUc7aU_9-_z-ebdxxrXxbs3cD-EsB9ucf-i3QBRZbUMOYDmG3b6xotYwxelWiucZkeTNHOnzBLWmTnyc3cItNfs6ooU1bEgBnJnOEDwBStsIfRun3UPmw4N470aJRbu62TCmCvlwd1i66KdBpsGnJllJ33Af-hiJW7xrwCIc5kRJS3va4pj-6t2xInXFJ5dI9YtOxbLoaXDDqivVBpkPiWa-sG5GNffviwMiA',
  },
  {
    id: '3',
    name: 'Sofia Rodriguez',
    specialty: 'Pilates & Dance',
    rating: 5.0,
    bio: 'Versatile instructor combining Pilates precision with dance movement. Professional dancer turned fitness instructor.',
    categories: ['Pilates', 'Dance'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQj3ttx8NtFsa5OQ7quGxYlB7Rvw6MSewDnaIOCiKIoJRXar2dGgKUTuoJza3Ts54ImXagW-9RJX4WGSuy_dVcQPM9DlWGMHy1V9j68kQce8ZhlhknC7VtOyUtV7e7gi2oqFum9Cbk1K0QEiY_BjYzNtOABnOT0OKEF1Rh2sYYEToQQ8R5r3nqdNR9C8F-0kExdHP6ESY1ARSQZ1Qej9G4rgZ4eLaGgeHz8EVq3xdFI7pt6UZNoQZQEJUjqs3JhOYSVGuba130hj4',
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    specialty: 'Strength Coach',
    rating: 4.9,
    bio: 'Certified strength and conditioning specialist. Helping athletes and fitness enthusiasts achieve their strength goals.',
    categories: ['Strength'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOC68IcJBcNAq18RFnWTzMo6MRY3Y_Hbeb8GrHCV6skCzK7FtEjs89lezkbf4cfKMWGFgTOfevUfOceFl3SS12yUo3mqCLedpIDe9-7YbjJPFttYZvIHh5krbVPSDLOq25AVPHpGWBethQ_Z6e6ULEqePChlYsFI6IBMMUMVJpe8z1VBqYdS44umEw5HHb8Lt1858LEq37oGhOZV3EJsz32x-rnrRHAZADXQ9GSX9SRXy24KaO2zzr5-l-NlMphq3dlLdODdwRDQI',
  },
  {
    id: '5',
    name: 'Emma Thompson',
    specialty: 'Cycling Instructor',
    rating: 4.6,
    bio: 'Energetic cycling instructor with a passion for indoor and outdoor cycling. Making every ride count!',
    categories: ['Cycling'],
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    name: 'James Martinez',
    specialty: 'Boxing Trainer',
    rating: 4.7,
    bio: 'Former professional boxer now training the next generation. Focus on technique, conditioning, and discipline.',
    categories: ['Boxing'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
]

export const categories = [
  { name: 'Yoga', icon: 'self_improvement' },
  { name: 'HIIT', icon: 'fitness_center' },
  { name: 'Pilates', icon: 'sports_gymnastics' },
  { name: 'Cycling', icon: 'directions_bike' },
  { name: 'Strength', icon: 'weight' },
  { name: 'Dance', icon: 'music_note' },
  { name: 'Boxing', icon: 'sports_mma' },
]

export const mockReviews = [
  {
    id: '1',
    instructorId: '1',
    author: 'Alice Johnson',
    rating: 5,
    comment: 'Olivia is an amazing instructor! Her classes are always well-structured and she provides great modifications for all levels.',
    date: '2024-01-15',
  },
  {
    id: '2',
    instructorId: '1',
    author: 'Bob Williams',
    rating: 4,
    comment: 'Great instructor, very knowledgeable. The classes are challenging but accessible for beginners too.',
    date: '2024-01-10',
  },
  {
    id: '3',
    instructorId: '2',
    author: 'Sarah Davis',
    rating: 5,
    comment: 'Ben\'s HIIT classes are intense and effective. I\'ve seen amazing results in just a few weeks!',
    date: '2024-01-20',
  },
]

