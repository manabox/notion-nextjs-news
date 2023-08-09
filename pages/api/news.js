import notion from '../../utils/notion';

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID
    });

    const news = response.results.map(page => ({
      id: page.id,
      title: page.properties.Title.title[0].text.content,
      // 他のプロパティも必要に応じて追加できます
    }));

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
