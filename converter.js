const cheerio = require('cheerio');
const fs = require('fs').promises;

class HayDayParser {
  parseTime(timeStr) {
    // Handle cases where there might be multiple times (e.g., "5 min\n★★★ 4 min")
    return timeStr.split('\n')[0].trim();
  }

  parsePriceRange(priceStr) {
    const [min, max] = priceStr.trim().split('-').map(n => parseInt(n));
    return { min, max };
  }

  parseTableRow($, tr) {
    const cells = $(tr).find('td');

    try {
      const name = $(cells[0]).find('a').first().attr('title');
      const imageUrl = $(cells[0]).find('img').attr('src');
      const level = parseInt($(cells[1]).text().trim());
      const xp = parseInt($(cells[2]).text().trim());
      const productionTime = this.parseTime($(cells[3]).text());
      const quantity = parseInt($(cells[4]).text().trim());

      // Store the raw HTML content for ingredients cell
      const ingredientsHtml = $(cells[5]).html();

      const producedIn = $(cells[6]).find('a').first().text().trim();
      const priceRange = this.parsePriceRange($(cells[7]).text());

      return {
        name,
        imageUrl,
        level,
        xp,
        productionTime,
        quantity,
        ingredientsHtml, // Store the raw HTML
        producedIn,
        priceRange
      };
    } catch (err) {
      console.error('Error parsing row:', err);
      return null;
    }
  }

  parseIngredients(ingredientsHtml) {
    // Create a new Cheerio instance for parsing ingredients
    const $ = cheerio.load(ingredientsHtml);
    const ingredients = [];

    // Find all ingredient links
    $('a').each((_, el) => {
      const ingredient = $(el);
      const name = ingredient.attr('title');
      // Look for the amount in the text after the link
      const amountMatch = ingredient.parent().html()
        .split(ingredient.toString())[1]
        .match(/\((\d+)\)/);
      const amount = amountMatch ? amountMatch[1] : '1';

      if (name) {
        ingredients.push({ name, amount: parseInt(amount) });
      }
    });

    return ingredients;
  }

  generateCypherQueries(itemData) {
    const queries = [];

    // Create Item node
    queries.push(`
            MERGE (item:Item {name: "${itemData.name}"})
            SET item.level = ${itemData.level},
                item.xp = ${itemData.xp},
                item.productionTime = "${itemData.productionTime}",
                item.quantity = ${itemData.quantity},
                item.imageUrl = "${itemData.imageUrl}",
                item.minPrice = ${itemData.priceRange?.min || 0},
                item.maxPrice = ${itemData.priceRange?.max || 0}`);

    // Create Production Location node and relationship
    queries.push(`
            MERGE (location:ProductionLocation {name: "${itemData.producedIn}"})
            MERGE (item:Item {name: "${itemData.name}"})
            MERGE (item)-[:PRODUCED_IN]->(location)`);

    // Parse and create ingredient relationships
    if (itemData.ingredientsHtml) {
      const ingredients = this.parseIngredients(itemData.ingredientsHtml);

      ingredients.forEach(({ name, amount }) => {
        queries.push(`
                    MATCH (item:Item {name: "${itemData.name}"})
                    MERGE (ingredient:Item {name: "${name}"})
                    MERGE (item)-[:REQUIRES {amount: ${amount}}]->(ingredient)`);
      });
    }

    return queries;
  }

  async processContent(content) {
    try {
      // Wrap the content in a table tag to make it valid HTML
      const wrappedContent = `<table>${content}</table>`;
      const $ = cheerio.load(wrappedContent);
      const allQueries = [];

      $('tr').each((_, element) => {
        const itemData = this.parseTableRow($, element);
        if (itemData && itemData.name) {
          const queries = this.generateCypherQueries(itemData);
          allQueries.push(...queries);
        }
      });

      // Write queries to file
      const outputPath = 'cypher_queries.txt';
      await fs.writeFile(
        outputPath,
        allQueries.join(';\n\n') + ';',
        'utf8'
      );

      console.log(`Processed ${allQueries.length / 3} items`);
      console.log(`Generated ${allQueries.length} queries`);
      console.log(`Queries saved to ${outputPath}`);

      return allQueries;
    } catch (err) {
      console.error('Error processing content:', err);
      throw err;
    }
  }
}

// Example usage:
async function main() {
  const parser = new HayDayParser();
  try {
    const content = await fs.readFile('./table_rows.html', 'utf8');
    await parser.processContent(content);
  } catch (err) {
    console.error('Error in main:', err);
  }
}

main();
