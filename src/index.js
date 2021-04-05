const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const content = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'content.json'), 'utf-8')
);

const sendEmbed = ({ webhookLink, className, color, id, password, link, comment }) => {
  const webhookContent = {
    content: 'Zoom Meeting Information',
    embeds: [
      {
        title: className || 'Unknown class',
        description: comment || 'Meeting Information',
        url: link,
        color: parseInt(color.replace('#', ''), 16),
        fields: [],
      },
    ],
  };
  if (id)
    webhookContent.embeds[0].fields.push({
      name: 'Meeting ID',
      value: id,
      inline: true,
    });
  if (password)
    webhookContent.embeds[0].fields.push({
      name: 'Meeting Password',
      value: password,
      inline: true,
    });
  if (link)
    webhookContent.embeds[0].fields.push({
      name: 'Join with link',
      value: `[Click here to join the meeting](${link})`,
    });

  axios.post(webhookLink, webhookContent);
};

Object.entries(content).forEach(([link, courses]) => {
  courses.forEach((course) => {
    course.classes.forEach((classObj) => {
      classObj.time.split(';').forEach((classTime) => {
        const [weekday, time] = classTime.split(',');
        const [hour, minute] = time.split(':');
        cron.schedule(
          `${minute} ${hour} * * ${weekday}`,
          () =>
            sendEmbed({
              webhookLink: link,
              className: course.title,
              color: course.color,
              ...classObj,
            }),
          { timezone: 'Europe/Lisbon' }
        );
      });
    });
  });
});
