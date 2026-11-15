
module.exports = {
  config: {
    name: "هح",
    aliases: ["مسح", "clearNick"],
    version: "1.0.0",
    author: "shtot",
    countDown: 5,
    role: 1,
    category: "group",
    shortDescription: "مسح كنيات أعضاء المجموعة"
  },

  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;

    try {
      const info = await api.getThreadInfo(threadID);
      const members = info.userInfo || [];

      const targets = members.filter(user =>
        user.id &&
        user.id !== api.getCurrentUserID() &&
        user.nickName &&
        user.nickName.trim() !== ""
      );

      if (targets.length === 0)
        return message.reply("ما كايناش كنيات باش نمسح.");

      message.reply(`بدأ مسح الكنيات، العدد: ${targets.length}`);

      let deleted = 0;
      let failed = 0;

      for (let i = 0; i < targets.length; i += 2) {
        const batch = targets.slice(i, i + 2);

        for (const user of batch) {
          try {
            await api.changeNickname("", threadID, user.id);
            deleted++;
          } catch (e) {
            failed++;
          }
        }

        if (i + 2 < targets.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      message.reply(
        `تم الانتهاء من مسح الكنيات.\n` +
        `✅ تم المسح: ${deleted}\n` +
        `❌ فشل: ${failed}`
      );

    } catch (err) {
      message.reply("وقع خطأ أثناء جلب أعضاء المجموعة.");
    }
  }
};
