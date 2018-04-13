# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.create({username: 'guest', password: 'password'})
User.create({username: 'gabriel', password: 'password'})
User.create({username: 'Albert Camus', password: 'password'})
User.create({username: 'George Orwell', password: 'password'})
User.create({username: 'George R.R. Martin', password: 'password'})
User.create({username: 'Arthur C. Clarke', password: 'password'})
Story.create({title: 'The Stranger', author_id: 3, body: "MOTHER died today. Or, maybe, yesterday; I can’t be sure. The telegram from the
Home says: YOUR MOTHER PASSED AWAY. FUNERAL TOMORROW. DEEP
SYMPATHY. Which leaves the matter doubtful; it could have been yesterday.
The Home for Aged Persons is at Marengo, some fifty miles from Algiers. With
the two o’clock bus I should get there well before nightfall. Then I can spend the
night there, keeping the usual vigil beside the body, and be back here by tomorrow
evening. I have fixed up with my employer for two days’ leave; obviously, under the
circumstances, he couldn’t refuse. Still, I had an idea he looked annoyed, and I said,
without thinking: “Sorry, sir, but it’s not my fault, you know.”
Afterwards it struck me I needn’t have said that. I had no reason to excuse myself;
it was up to him to express his sympathy and so forth. Probably he will do so the day
after tomorrow, when he sees me in black. For the present, it’s almost as if Mother
weren’t really dead. The funeral will bring it home to me, put an official seal on it, so
to speak. ...
I took the two-o’clock bus. It was a blazing hot afternoon. I’d lunched, as usual, at
Céleste’s restaurant. Everyone was most kind, and Céleste said to me, “There’s no
one like a mother.” When I left they came with me to the door. It was something of a
rush, getting away, as at the last moment I had to call in at Emmanuel’s place to
borrow his black tie and mourning band. He lost his uncle a few months ago.
I had to run to catch the bus. I suppose it was my hurrying like that, what with the
glare off the road and from the sky, the reek of gasoline, and the jolts, that made me
feel so drowsy. Anyhow, I slept most of the way. When I woke I was leaning against
a soldier; he grinned and asked me if I’d come from a long way off, and I just
nodded, to cut things short. I wasn’t in a mood for talking.
The Home is a little over a mile from the village. I went there on foot. I asked to
be allowed to see Mother at once, but the doorkeeper told me I must see the warden
first. He wasn’t free, and I had to wait a bit. The doorkeeper chatted with me while I
waited; then he led me to the office. The warden was a very small man, with gray
hair, and a Legion of Honor rosette in his buttonhole. He gave me a long look with
his watery blue eyes. Then we shook hands, and he held mine so long that I began to
feel embarrassed. After that he consulted a register on his table, and said:
“Madame Meursault entered the Home three years ago. She had no private means
and depended entirely on you.", image: File.open(File.join(Rails.root, '/app/assets/images/elisabetta-foco-241-unsplash.jpg'))  })

Story.create
