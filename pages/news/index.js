import Link from 'next/link';

export default function NewsPage({ news }) {
    return (
      <div>
        <h1>お知らせ</h1>
        <ul>
        {news.map(item => (
            <li key={item.id}>
                <Link href={`/news/${item.id}`}>{item.title}</Link>
            </li>
        ))}
        </ul>
      </div>
    );
  }

export async function getServerSideProps() {
    const res = await fetch('http://localhost:3000/api/news');
    const data = await res.json();
  
    if (!Array.isArray(data)) {
      console.error('API response is not an array:', data);
      return {
        props: {
          news: []
        }
      };
    }
  
    return {
      props: {
        news: data
      }
    };
  }
  