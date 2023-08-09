import notion from '../../utils/notion';

function groupListItems(blocks) {
    const grouped = [];
    let currentGroup = [];
  
    blocks.forEach((block, index) => {
      if (block.type === 'bulleted_list_item') {
        currentGroup.push(block);
      } else {
        if (currentGroup.length) {
          grouped.push(currentGroup);
          currentGroup = [];
        }
        grouped.push(block);
      }
  
      if (index === blocks.length - 1 && currentGroup.length) {
        grouped.push(currentGroup);
      }
    });
  
    return grouped;
  }
  

function NewsDetail({ newsItem }) {
    const groupedBlocks = groupListItems(newsItem.blocks);

    return (
        <div>
            <h1>{newsItem.title}</h1>
            <p>{newsItem.date}</p>
            <div>
                {groupedBlocks.map((groupOrBlock, index) => {
                if (Array.isArray(groupOrBlock)) {
                    // This is a group of list items
                    return (
                    <ul key={index}>
                        {groupOrBlock.map(block => (
                        <li key={block.id}>
                            {block.bulleted_list_item?.rich_text[0]?.text?.content}
                        </li>
                        ))}
                    </ul>
                    );
                } else {
                    // This is a regular block
                    const block = groupOrBlock;
                    switch (block.type) {
                    case 'paragraph':
                        return <p key={block.id}>{block.paragraph?.rich_text[0]?.text?.content}</p>;
                    case 'heading_1':
                        return <h1 key={block.id}>{block.heading_1?.rich_text[0]?.text?.content}</h1>;
                    case 'heading_2':
                        return <h2 key={block.id}>{block.heading_2?.rich_text[0]?.text?.content}</h2>;
                    // ... 他のブロックタイプの場合も同様に
                    default:
                        return null;
                    }
                }
                })}
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    // ページの詳細情報を取得
    const response = await notion.pages.retrieve({ page_id: id });
    
    // ページ内のすべてのブロックを取得
    const blocksResponse = await notion.blocks.children.list({ block_id: id });

    const newsItem = {
        id: response.id,
        title: response.properties.Title.title[0].text.content,
        date: response.properties.Date.date.start,
        blocks: blocksResponse.results,
    };

    return {
        props: {
            newsItem
        }
    };
}

export default NewsDetail;
 