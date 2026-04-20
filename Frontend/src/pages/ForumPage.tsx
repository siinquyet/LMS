import { useState } from 'react';
import { MessageCircle, Eye, Clock, User, Search, Plus, ThumbsUp, Reply } from 'lucide-react';
import { Button, Card, Avatar, Badge, Input } from '../components/common';
import { forumTopics, forumReplies, users, courses } from '../mockData';

interface ForumTopicWithAuthor {
  id: number;
  author: { name: string; avatar: string };
  title: string;
  content: string;
  courseName?: string;
  views: number;
  replies: number;
  createdAt: string;
  updatedAt: string;
}

const enrichedTopics: ForumTopicWithAuthor[] = forumTopics.map(topic => {
  const author = users.find(u => u.id === topic.nguoi_dung_id);
  const course = topic.khoa_hoc_id ? courses.find(c => c.id === topic.khoa_hoc_id) : null;
  return {
    id: topic.id,
    author: {
      name: author ? `${author.ho} ${author.ten}` : 'Unknown',
      avatar: author?.anh_dai_dien || 'https://picsum.photos/seed/default/100/100',
    },
    title: topic.tieu_de,
    content: topic.noi_dung,
    courseName: course?.tieu_de,
    views: topic.luot_xem,
    replies: topic.luot_tra_loi,
    createdAt: topic.ngay_tao,
    updatedAt: topic.ngay_cap_nhat,
  };
});

export const ForumPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<ForumTopicWithAuthor | null>(null);

  const filteredTopics = enrichedTopics.filter(topic =>
    topic.title.toLowerCase().includes(search.toLowerCase()) ||
    topic.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleTopicClick = (topic: ForumTopicWithAuthor) => {
    setSelectedTopic(topic);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  if (selectedTopic) {
    const replies = forumReplies.filter(r => r.topic_id === selectedTopic.id).map(reply => {
      const author = users.find(u => u.id === reply.nguoi_dung_id);
      return {
        ...reply,
        author: {
          name: author ? `${author.ho} ${author.ten}` : 'Unknown',
          avatar: author?.anh_dai_dien || 'https://picsum.photos/seed/default/100/100',
        },
      };
    });

    return (
      <div className="min-h-screen bg-[#F8F6F3] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            ← Quay lại
          </Button>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={selectedTopic.author.avatar} alt={selectedTopic.author.name} />
              <div>
                <p className="font-semibold">{selectedTopic.author.name}</p>
                <p className="text-sm text-gray-500">{selectedTopic.createdAt}</p>
              </div>
            </div>
            
            <h1 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] mb-4">
              {selectedTopic.title}
            </h1>
            
            {selectedTopic.courseName && (
              <Badge variant="info" className="mb-4">{selectedTopic.courseName}</Badge>
            )}
            
            <p className="text-gray-700 mb-6">{selectedTopic.content}</p>
            
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {selectedTopic.views} lượt xem
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> {selectedTopic.replies} trả lời
              </span>
            </div>
          </Card>

          <div className="mt-6">
            <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4">
              Trả lời ({replies.length})
            </h2>
            
            {replies.map(reply => (
              <Card key={reply.id} className="p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Avatar src={reply.author.avatar} alt={reply.author.name} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{reply.author.name}</span>
                      <span className="text-sm text-gray-500">{reply.ngay_tao}</span>
                    </div>
                    <p className="text-gray-700">{reply.noi_dung}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 mt-6">
            <textarea
              className="w-full p-3 border rounded-lg resize-none"
              rows={4}
              placeholder="Viết trả lời của bạn..."
            />
            <Button variant="primary" className="mt-3">
              Gửi trả lời
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] flex items-center gap-3">
            <MessageCircle className="w-8 h-8" />
            Diễn đàn
          </h1>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Tạo chủ đề mới
          </Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Tìm kiếm trong diễn đàn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="space-y-4">
          {filteredTopics.map(topic => (
            <Card
              key={topic.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="flex items-start gap-4">
                <Avatar src={topic.author.avatar} alt={topic.author.name} />
                <div className="flex-1">
                  <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{topic.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" /> {topic.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {topic.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {topic.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" /> {topic.replies}
                    </span>
                    {topic.courseName && (
                      <Badge variant="info" className="text-xs">{topic.courseName}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Không có chủ đề nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
