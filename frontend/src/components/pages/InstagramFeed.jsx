const mockPosts = [
  { id: 1, image: "https://picsum.photos/300/300?random=1" },
  { id: 2, image: "https://picsum.photos/300/300?random=2" },
  { id: 3, image: "https://picsum.photos/300/300?random=3" },
  { id: 4, image: "https://picsum.photos/300/300?random=4" },
  { id: 5, image: "https://picsum.photos/300/300?random=5" },
  { id: 6, image: "https://picsum.photos/300/300?random=6" },
  { id: 7, image: "https://picsum.photos/300/300?random=7" },
  { id: 8, image: "https://picsum.photos/300/300?random=8" },
  { id: 9, image: "https://picsum.photos/300/300?random=9" },
  { id: 10, image: "https://picsum.photos/300/300?random=10" },
  { id: 11, image: "https://picsum.photos/300/300?random=11" },
  { id: 12, image: "https://picsum.photos/300/300?random=12" },
];

const InstagramFeed = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {mockPosts.map((post) => (
        <div key={post.id} className="w-full h-64 overflow-hidden rounded-lg shadow">
          <img
            src={post.image}
            alt={`Post ${post.id}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default InstagramFeed;
