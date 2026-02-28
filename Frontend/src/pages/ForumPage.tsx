import {
	Bookmark,
	BookmarkCheck,
	Bell,
	BellOff,
	ChevronDown,
	Code,
	Flag,
	Heart,
	Image,
	Link2,
	MessageCircle,
	MessageSquare,
	MoreHorizontal,
	Paperclip,
	Plus,
	Reply,
	Search,
	Send,
	Share2,
	StickyNote,
	User,
	UserCheck,
	UserMinus,
	UserPlus,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import ActionButton from "../components/common/ActionButton";


type TabType = "discussion" | "friends" | "groups";

interface Post {
	id: number;
	author: {
		name: string;
		avatar: string;
		role: string;
		intro?: string;
	};
	content: string;
	images?: string[];
	tags: string[];
	likes: number;
	comments: number;
	shares: number;
	createdAt: string;
	isLiked: boolean;
	isBookmarked: boolean;
}

interface Friend {
	id: number;
	name: string;
	avatar: string;
	role: string;
	status: "online" | "offline" | "busy";
	mutualFriends: number;
}

interface Group {
	id: number;
	name: string;
	avatar: string;
	members: number;
	description: string;
	isJoined: boolean;
}

interface PostComment {
	id: number;
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	likes: number;
	createdAt: string;
	replies?: PostComment[];
}

const ForumPage = () => {
	const [activeTab, setActiveTab] = useState<TabType>("discussion");
	const [showCreatePost, setShowCreatePost] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [newPostContent, setNewPostContent] = useState("");
	const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set([1, 3]));
	const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());
	const [openMenuPostId, setOpenMenuPostId] = useState<number | null>(null);
	const [reportModal, setReportModal] = useState<{ post: Post | null; open: boolean }>({ post: null, open: false });
	const [reportReason, setReportReason] = useState("");
	const [reportDetails, setReportDetails] = useState("");
	const [reportLoading, setReportLoading] = useState(false);
	const [reportSuccess, setReportSuccess] = useState(false);
	const [userProfileModal, setUserProfileModal] = useState<{ user: Post["author"] | null; open: boolean }>({ user: null, open: false });
	const [createGroupModal, setCreateGroupModal] = useState(false);
	const [inviteToGroupModal, setInviteToGroupModal] = useState<{ group: Group | null; open: boolean }>({ group: null, open: false });
	const [addFriendModal, setAddFriendModal] = useState(false);
	const [friendRequests, setFriendRequests] = useState<{ id: number; name: string; avatar: string; time: string }[]>([
		{ id: 1, name: "Hoàng Văn E", avatar: "from-orange-500 to-red-600", time: "1 phút trước" },
		{ id: 2, name: "Nguyễn Thị F", avatar: "from-cyan-500 to-blue-600", time: "5 phút trước" },
	]);
	const [sentFriendRequests, setSentFriendRequests] = useState<number[]>([]);
	const [friendList, setFriendList] = useState<number[]>([1, 2]);
	const [currentChatUser, setCurrentChatUser] = useState<{ id: number; name: string; avatar: string } | null>(null);
	const [chatNotifications, setChatNotifications] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });
	const [replyToMessage, setReplyToMessage] = useState<{ id: number; name: string; content: string } | null>(null);

	const [posts, setPosts] = useState<Post[]>([
		{
			id: 1,
			author: {
				name: "Nguyễn Văn A",
				avatar: "from-blue-500 to-indigo-600",
				role: "Học viên",
				intro: "Học viên ngành Công nghệ Thông tin. Đam mê React và JavaScript.",
			},
			content:
				"Mọi người cho mình hỏi về cách sử dụng useEffect trong React với ạ. Mình đang gặp vấn đề về infinite loop khi dùng dependency array. Có cách nào fix không ạ?",
			tags: ["React", "JavaScript", "Hooks"],
			likes: 24,
			comments: 8,
			shares: 3,
			createdAt: "2 giờ trước",
			isLiked: true,
			isBookmarked: false,
		},
		{
			id: 2,
			author: {
				name: "Trần Thị B",
				avatar: "from-pink-500 to-rose-600",
				role: "Học viên",
				intro: "Fresh graduate, đang tìm kiếm cơ hội trong lĩnh vực Frontend Development.",
			},
			content:
				"Chia sẻ kinh nghiệm học lập trình của mình nha! Điều quan trọng nhất là thực hành mỗi ngày, đừng chỉ đọc lý thuyết. Mình dành ít nhất 2 tiếng mỗi ngày để code project nhỏ.",
			tags: ["Kinh nghiệm", "Học tập"],
			likes: 45,
			comments: 12,
			shares: 8,
			createdAt: "5 giờ trước",
			isLiked: false,
			isBookmarked: true,
		},
		{
			id: 3,
			author: {
				name: "Lê Văn C",
				avatar: "from-green-500 to-teal-600",
				role: "Giảng viên",
				intro: "Giảng viên React & Node.js với 5 năm kinh nghiệm trong ngành.",
			},
			content:
				"📢 Thông báo: Tuần này chúng ta sẽ học về React Router và cách xây dựng SPA. Các bạn nhớ chuẩn bị trước nhé! Link tài liệu trong comment.",
			tags: ["Thông báo", "React Router"],
			likes: 67,
			comments: 23,
			shares: 15,
			createdAt: "1 ngày trước",
			isLiked: true,
			isBookmarked: false,
		},
		{
			id: 4,
			author: {
				name: "Phạm Thị D",
				avatar: "from-purple-500 to-indigo-600",
				role: "Học viên",
				intro: "Sinh viên năm 3, yêu thích TypeScript và Backend Development.",
			},
			content:
				"Mọi người có tài liệu hay về TypeScript không ạ? Mình muốn tìm hiểu thêm về generics và advanced types. Cảm ơn mọi người!",
			tags: ["TypeScript", "Tài liệu"],
			likes: 18,
			comments: 6,
			shares: 2,
			createdAt: "2 ngày trước",
			isLiked: false,
			isBookmarked: false,
		},
	]);

	const [friends] = useState<Friend[]>([
		{
			id: 1,
			name: "Nguyễn Văn A",
			avatar: "from-blue-500 to-indigo-600",
			role: "Học viên",
			status: "online",
			mutualFriends: 5,
		},
		{
			id: 2,
			name: "Trần Thị B",
			avatar: "from-pink-500 to-rose-600",
			role: "Học viên",
			status: "online",
			mutualFriends: 3,
		},
		{
			id: 3,
			name: "Lê Văn C",
			avatar: "from-green-500 to-teal-600",
			role: "Giảng viên",
			status: "busy",
			mutualFriends: 8,
		},
		{
			id: 4,
			name: "Phạm Thị D",
			avatar: "from-purple-500 to-indigo-600",
			role: "Học viên",
			status: "offline",
			mutualFriends: 2,
		},
		{
			id: 5,
			name: "Hoàng Văn E",
			avatar: "from-orange-500 to-red-600",
			role: "Học viên",
			status: "online",
			mutualFriends: 6,
		},
	]);

	const [groups, setGroups] = useState<Group[]>([
		{
			id: 1,
			name: "React Developers Vietnam",
			avatar: "from-blue-500 to-indigo-600",
			members: 1250,
			description: "Cộng đồng React Việt Nam - Chia sẻ kiến thức và kinh nghiệm",
			isJoined: true,
		},
		{
			id: 2,
			name: "TypeScript Việt Nam",
			avatar: "from-blue-400 to-cyan-600",
			members: 890,
			description: "Học và trao đổi về TypeScript",
			isJoined: false,
		},
		{
			id: 3,
			name: "Fullstack Developers",
			avatar: "from-green-500 to-teal-600",
			members: 2100,
			description: "Cộng đồng lập trình viên Fullstack",
			isJoined: true,
		},
		{
			id: 4,
			name: "Python AI/ML",
			avatar: "from-yellow-500 to-orange-600",
			members: 1800,
			description: "Machine Learning và Artificial Intelligence",
			isJoined: false,
		},
	]);

	const [postComments, setPostComments] = useState<Record<number, PostComment[]>>({
		1: [
			{
				id: 1,
				author: { name: "Lê Văn C", avatar: "from-green-500 to-teal-600" },
				content: "Bạn có thể kiểm tra dependency array kỹ hơn. Nếu không cần chạy lại thì để mảng rỗng []",
				likes: 5,
				createdAt: "1 giờ trước",
			},
			{
				id: 2,
				author: { name: "Phạm Thị D", avatar: "from-purple-500 to-indigo-600" },
				content: "Mình cũng từng gặp vấn đề này! Giải pháp là dùng useCallback cho function",
				likes: 3,
				createdAt: "30 phút trước",
			},
		],
	});

	const [newComments, setNewComments] = useState<Record<number, string>>({});

	const handleLike = (postId: number) => {
		const newLiked = new Set(likedPosts);
		if (newLiked.has(postId)) {
			newLiked.delete(postId);
			setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes - 1, isLiked: false } : p));
		} else {
			newLiked.add(postId);
			setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1, isLiked: true } : p));
		}
		setLikedPosts(newLiked);
	};

	const handleBookmark = (postId: number) => {
		const newBookmarked = new Set(bookmarkedPosts);
		if (newBookmarked.has(postId)) {
			newBookmarked.delete(postId);
			setPosts(posts.map(p => p.id === postId ? { ...p, isBookmarked: false } : p));
		} else {
			newBookmarked.add(postId);
			setPosts(posts.map(p => p.id === postId ? { ...p, isBookmarked: true } : p));
		}
		setBookmarkedPosts(newBookmarked);
	};

	const handleCreatePost = () => {
		if (!newPostContent.trim()) return;
		const newPost: Post = {
			id: Date.now(),
			author: {
				name: "Bạn",
				avatar: "from-blue-500 to-indigo-600",
				role: "Học viên",
			},
			content: newPostContent,
			tags: [],
			likes: 0,
			comments: 0,
			shares: 0,
			createdAt: "Vừa xong",
			isLiked: false,
			isBookmarked: false,
		};
		setPosts([newPost, ...posts]);
		setNewPostContent("");
		setShowCreatePost(false);
	};

	const handleJoinGroup = (groupId: number) => {
		setGroups(groups.map(g => 
			g.id === groupId ? { ...g, isJoined: !g.isJoined, members: g.isJoined ? g.members - 1 : g.members + 1 } : g
		));
	};

	const handleSendFriendRequest = (friendId: number) => {
		if (!sentFriendRequests.includes(friendId)) {
			setSentFriendRequests([...sentFriendRequests, friendId]);
		}
	};

	const handleAcceptFriendRequest = (requestId: number) => {
		setFriendRequests(friendRequests.filter(r => r.id !== requestId));
		setFriendList([...friendList, requestId]);
	};

	const handleDeclineFriendRequest = (requestId: number) => {
		setFriendRequests(friendRequests.filter(r => r.id !== requestId));
	};

	const handleCreateGroup = () => {
		setCreateGroupModal(false);
		alert("Tạo nhóm thành công!");
	};

	const handleInviteToGroup = (group: Group | null) => {
		if (!group) return;
		setInviteToGroupModal({ group: null, open: false });
		alert(`Đã gửi lời mời tham gia nhóm ${group.name}!`);
	};

	const handleAddComment = (postId: number) => {
		const content = newComments[postId];
		if (!content?.trim()) return;
		
		const newComment: PostComment = {
			id: Date.now(),
			author: { name: "Bạn", avatar: "from-blue-500 to-indigo-600" },
			content,
			likes: 0,
			createdAt: "Vừa xong",
		};
		
		setPostComments({
			...postComments,
			[postId]: [...(postComments[postId] || []), newComment],
		});
		setNewComments({ ...newComments, [postId]: "" });
		setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
	};

	const handleOpenReport = (post: Post) => {
		setOpenMenuPostId(null);
		setReportModal({ post, open: true });
		setReportReason("");
		setReportDetails("");
		setReportSuccess(false);
	};

	const handleSubmitReport = async () => {
		if (!reportReason) return;
		setReportLoading(true);
		try {
			const res = await fetch("/api/v1/reports", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					reported_user_id: reportModal.post?.author.name,
					reason: reportReason,
					details: reportDetails,
				}),
			});
			if (res.ok) {
				setReportSuccess(true);
				setTimeout(() => {
					setReportModal({ post: null, open: false });
				}, 2000);
			}
		} catch {
		} finally {
			setReportLoading(false);
		}
	};

	const reportReasons = ["Spam", "Quấy rối", "Nội dung không phù hợp", "Khác"];

	const tags = [
		{ name: "Tất cả", count: 156 },
		{ name: "React", count: 45 },
		{ name: "JavaScript", count: 38 },
		{ name: "TypeScript", count: 22 },
		{ name: "Node.js", count: 18 },
		{ name: "Python", count: 15 },
		{ name: "Kinh nghiệm", count: 12 },
		{ name: "Thông báo", count: 6 },
	];

	const tabs = [
		{ key: "discussion", label: "Thảo luận", icon: MessageSquare },
		{ key: "friends", label: "Bạn bè", icon: UserPlus },
		{ key: "groups", label: "Nhóm", icon: Users },
	];

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<div className="bg-white border-b border-slate-200 sticky top-0 z-20">
				<div className="max-w-6xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h1 className="text-2xl font-bold text-slate-900">Diễn đàn thảo luận</h1>
							<p className="text-slate-500 text-sm">Kết nối, học hỏi và chia sẻ cùng cộng đồng</p>
						</div>
						<button
							type="button"
							onClick={() => setShowCreatePost(true)}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Plus className="w-4 h-4" />
							<span>Tạo bài viết</span>
						</button>
					</div>

					{/* Tabs */}
					<div className="flex gap-1 border-b border-slate-200">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => setActiveTab(tab.key as TabType)}
								className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
									activeTab === tab.key
										? "border-blue-600 text-blue-600"
										: "border-transparent text-slate-500 hover:text-slate-700"
								}`}
							>
								<tab.icon className="w-4 h-4" />
								{tab.label}
								{tab.key === "friends" && friendRequests.length > 0 && (
									<span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
										{friendRequests.length}
									</span>
								)}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-6">
				<div className="flex gap-6">
					{/* Main Content */}
					<div className="flex-1">
						{activeTab === "discussion" && (
							<div className="space-y-4">
								{/* Search & Filter */}
								<div className="bg-white rounded-xl p-4 border border-slate-200">
									<div className="flex gap-3">
										<div className="relative flex-1">
											<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
											<input
												type="text"
												placeholder="Tìm kiếm bài viết..."
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
											/>
										</div>
										<button type="button" className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
											<StickyNote className="w-4 h-4" />
											Chủ đề
										</button>
									</div>
									{/* Tags */}
									<div className="flex gap-2 mt-3 flex-wrap">
										{tags.map((tag) => (
											<button
												key={tag.name}
												type="button"
												className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
											>
												{tag.name}
												<span className="ml-1 text-slate-400">({tag.count})</span>
											</button>
										))}
									</div>
								</div>

								{/* Posts */}
								{posts.map((post) => (
									<div key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
										<div className="p-4">
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-center gap-3">
													<button
														type="button"
														onClick={() => setUserProfileModal({ user: post.author, open: true })}
														className={`w-10 h-10 bg-gradient-to-r ${post.author.avatar} rounded-full flex items-center justify-center hover:opacity-80 transition-opacity`}
													>
														<User className="w-5 h-5 text-white" />
													</button>
													<div>
														<div className="flex items-center gap-2">
															<button
																type="button"
																onClick={() => setUserProfileModal({ user: post.author, open: true })}
																className="font-medium text-slate-900 hover:underline"
															>
																{post.author.name}
															</button>
															<span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-500 rounded-full">
																{post.author.role}
															</span>
														</div>
														<span className="text-xs text-slate-400">{post.createdAt}</span>
													</div>
												</div>
												<div className="relative">
													<button 
														type="button" 
														className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
														onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)}
													>
														<MoreHorizontal className="w-5 h-5" />
													</button>
													{openMenuPostId === post.id && (
														<div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
															<button
																type="button"
																onClick={() => handleOpenReport(post)}
																className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
															>
																<Flag className="w-4 h-4" />
																Báo cáo
															</button>
														</div>
													)}
												</div>
											</div>

											<p className="text-slate-700 mb-3 whitespace-pre-wrap">{post.content}</p>

								{post.tags.length > 0 && (
									<div className="flex gap-2 mb-3">
										{post.tags.map((tag) => (
											<span key={tag} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
												#{tag}
											</span>
										))}
									</div>
								)}

											<div className="flex items-center justify-between pt-3 border-t border-slate-100">
												<div className="flex items-center gap-4">
													<button
														type="button"
														onClick={() => handleLike(post.id)}
														className={`flex items-center gap-1.5 text-sm ${
															likedPosts.has(post.id) ? "text-red-500" : "text-slate-500 hover:text-red-500"
														}`}
													>
														<Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
														<span>{post.likes}</span>
													</button>
													<button
														type="button"
														onClick={() => setSelectedPost(post)}
														className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600"
													>
														<MessageCircle className="w-4 h-4" />
														<span>{post.comments}</span>
													</button>
													<button type="button" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600">
														<Share2 className="w-4 h-4" />
														<span>{post.shares}</span>
													</button>
												</div>
												<button
													type="button"
													onClick={() => handleBookmark(post.id)}
													className={`p-2 rounded-lg ${bookmarkedPosts.has(post.id) ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"}`}
												>
													{bookmarkedPosts.has(post.id) ? (
														<BookmarkCheck className="w-4 h-4" />
													) : (
														<Bookmark className="w-4 h-4" />
													)}
												</button>
											</div>
										</div>

										{/* Comments Preview */}
										{postComments[post.id] && postComments[post.id].length > 0 && (
											<div className="border-t border-slate-100 p-4">
												{postComments[post.id].slice(0, 2).map((comment) => (
													<div key={comment.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
														<div className="flex gap-3">
															<div className={`w-10 h-10 bg-gradient-to-r ${comment.author.avatar} rounded-full flex items-center justify-center shrink-0`}>
																<User className="w-5 h-5 text-white" />
															</div>
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-1">
																	<span className="font-medium text-slate-900">{comment.author.name}</span>
																	<span className="text-xs text-slate-400">- {comment.createdAt}</span>
																</div>
																<p className="text-slate-600 text-sm mb-2">{comment.content}</p>
																<div className="flex items-center gap-4">
																	<button type="button" className="flex items-center gap-1 text-sm text-slate-400 hover:text-blue-600">
																		<Heart className="w-4 h-4" />
																		<span>{comment.likes}</span>
									</button>
																	<button type="button" className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-600">
																		<Heart className="w-4 h-4" />
																		<span>0</span>
									</button>
																	<button type="button" className="text-sm text-slate-400 hover:text-blue-600">
																		Trả lời
																	</button>
																</div>
															</div>
														</div>
													</div>
												))}
												{postComments[post.id].length > 2 && (
													<button
														type="button"
														onClick={() => setSelectedPost(post)}
														className="text-sm text-blue-600 hover:underline mt-2"
													>
														Xem thêm {postComments[post.id].length - 2} bình luận
													</button>
												)}
											</div>
										)}

										{/* Comment Input */}
										<div className="border-t border-slate-100 p-3">
											<textarea
												placeholder="Viết bình luận..."
												value={newComments[post.id] || ""}
												onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
												className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
												rows={3}
											/>
											<ActionButton className="mt-3" onClick={() => handleAddComment(post.id)}>
												Gửi bình luận
											</ActionButton>
										</div>
									</div>
								))}
							</div>
						)}

						{activeTab === "friends" && (
							<div className="space-y-4">
								{/* Friend Requests */}
								{friendRequests.length > 0 && (
									<div className="bg-white rounded-xl p-4 border border-slate-200">
										<h3 className="font-semibold text-slate-900 mb-3">Lời mời kết bạn ({friendRequests.length})</h3>
										<div className="space-y-3">
											{friendRequests.map((request) => (
												<div key={request.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
													<div className={`w-10 h-10 bg-gradient-to-r ${request.avatar} rounded-full flex items-center justify-center`}>
														<User className="w-5 h-5 text-white" />
													</div>
													<div className="flex-1">
														<p className="font-medium text-slate-900">{request.name}</p>
														<p className="text-xs text-slate-400">{request.time}</p>
													</div>
													<div className="flex gap-2">
														<button
															type="button"
															onClick={() => handleAcceptFriendRequest(request.id)}
															className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
														>
															<UserCheck className="w-4 h-4" />
														</button>
														<button
															type="button"
															onClick={() => handleDeclineFriendRequest(request.id)}
															className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100"
														>
															<UserMinus className="w-4 h-4" />
														</button>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								<div className="bg-white rounded-xl p-4 border border-slate-200">
									<div className="flex gap-3">
										<div className="relative flex-1">
											<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
											<input
												type="text"
												placeholder="Tìm kiếm bạn bè..."
												className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
											/>
										</div>
										<button
											type="button"
											onClick={() => setAddFriendModal(true)}
											className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
										>
											<UserPlus className="w-4 h-4" />
											Thêm bạn
										</button>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{friends.map((friend) => (
										<div key={friend.id} className="bg-white rounded-xl p-4 border border-slate-200">
											<div className="flex items-center gap-3 mb-3">
												<div className="relative">
													<div className={`w-12 h-12 bg-gradient-to-r ${friend.avatar} rounded-full flex items-center justify-center`}>
														<User className="w-6 h-6 text-white" />
													</div>
													<span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
														friend.status === "online" ? "bg-green-500" : friend.status === "busy" ? "bg-red-500" : "bg-slate-400"
													}`} />
												</div>
												<div className="flex-1">
													<h3 className="font-medium text-slate-900">{friend.name}</h3>
													<p className="text-xs text-slate-500">{friend.role}</p>
												</div>
											</div>
											<p className="text-xs text-slate-500 mb-3">{friend.mutualFriends} bạn chung</p>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => setShowChat(true)}
													className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
												>
													<MessageCircle className="w-4 h-4" />
													Nhắn tin
												</button>
												<button type="button" className="px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">
													<Share2 className="w-4 h-4" />
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{activeTab === "groups" && (
							<div className="space-y-4">
								<div className="bg-white rounded-xl p-4 border border-slate-200">
									<div className="flex gap-3">
										<div className="relative flex-1">
											<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
											<input
												type="text"
												placeholder="Tìm kiếm nhóm..."
												className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
											/>
										</div>
										<button
											type="button"
											onClick={() => setCreateGroupModal(true)}
											className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
										>
											<Plus className="w-4 h-4" />
											Tạo nhóm
										</button>
									</div>
								</div>

								{groups.map((group) => (
									<div key={group.id} className="bg-white rounded-xl p-4 border border-slate-200">
										<div className="flex items-start gap-3 mb-3">
											<div className={`w-14 h-14 bg-gradient-to-r ${group.avatar} rounded-xl flex items-center justify-center shrink-0`}>
												<Users className="w-7 h-7 text-white" />
											</div>
											<div className="flex-1">
												<h3 className="font-medium text-slate-900 mb-1">{group.name}</h3>
												<p className="text-xs text-slate-500">{group.members.toLocaleString()} thành viên</p>
											</div>
										</div>
										<p className="text-sm text-slate-600 mb-3">{group.description}</p>
											<div className="flex gap-2">
											{group.isJoined ? (
												<>
													<button
														type="button"
														onClick={() => setShowChat(true)}
														className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
													>
														<MessageCircle className="w-4 h-4" />
														Vào nhóm chat
													</button>
													<button 
														type="button" 
														onClick={() => setInviteToGroupModal({ group, open: true })}
														className="px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50"
														title="Mời"
													>
														<UserPlus className="w-4 h-4" />
													</button>
												</>
											) : (
												<button
													type="button"
													onClick={() => handleJoinGroup(group.id)}
													className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
												>
													<UserPlus className="w-4 h-4" />
													Tham gia nhóm
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="w-80 space-y-4">
						{/* Quick Stats */}
						<div className="bg-white rounded-xl p-4 border border-slate-200">
							<h3 className="font-semibold text-slate-900 mb-3">Thống kê</h3>
							<div className="grid grid-cols-2 gap-3">
								<div className="text-center p-3 bg-slate-50 rounded-lg">
									<p className="text-2xl font-bold text-blue-600">156</p>
									<p className="text-xs text-slate-500">Bài viết</p>
								</div>
								<div className="text-center p-3 bg-slate-50 rounded-lg">
									<p className="text-2xl font-bold text-green-600">48</p>
									<p className="text-xs text-slate-500">Bạn bè</p>
								</div>
								<div className="text-center p-3 bg-slate-50 rounded-lg">
									<p className="text-2xl font-bold text-purple-600">5</p>
									<p className="text-xs text-slate-500">Nhóm</p>
								</div>
								<div className="text-center p-3 bg-slate-50 rounded-lg">
									<p className="text-2xl font-bold text-orange-600">12</p>
									<p className="text-xs text-slate-500">Đang online</p>
								</div>
							</div>
						</div>

						{/* Popular Tags */}
						<div className="bg-white rounded-xl p-4 border border-slate-200">
							<h3 className="font-semibold text-slate-900 mb-3">Chủ đề hot</h3>
							<div className="space-y-2">
								{["React", "JavaScript", "TypeScript", "Node.js", "Python"].map((tag) => (
									<button
										key={tag}
										type="button"
										className="w-full flex items-center justify-between p-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
									>
										<span className="flex items-center gap-2">
											<Code className="w-4 h-4 text-blue-500" />
											{tag}
										</span>
										<ChevronDown className="w-4 h-4" />
									</button>
								))}
							</div>
						</div>

						{/* Online Friends */}
						<div className="bg-white rounded-xl p-4 border border-slate-200">
							<h3 className="font-semibold text-slate-900 mb-3">Bạn đang online</h3>
							<div className="space-y-2">
								{friends.filter(f => f.status === "online").map((friend) => (
									<button
										key={friend.id}
										type="button"
										onClick={() => setShowChat(true)}
										className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg"
									>
										<div className="relative">
											<div className={`w-8 h-8 bg-gradient-to-r ${friend.avatar} rounded-full flex items-center justify-center`}>
												<User className="w-4 h-4 text-white" />
											</div>
											<span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
										</div>
										<span className="text-sm text-slate-700">{friend.name}</span>
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Create Post Modal */}
			{showCreatePost && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div 
						className="absolute inset-0 bg-black/50" 
						onClick={() => setShowCreatePost(false)}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === "Escape" && setShowCreatePost(false)}
					/>
					<div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
						<div className="flex items-center justify-between p-4 border-b border-slate-200">
							<h2 className="text-lg font-semibold text-slate-900">Tạo bài viết mới</h2>
							<button
								type="button"
								onClick={() => setShowCreatePost(false)}
								className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="p-4">
							<div className="flex gap-3 mb-4">
								<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
									<User className="w-5 h-5 text-white" />
								</div>
								<div>
									<p className="font-medium text-slate-900">Bạn</p>
									<p className="text-xs text-slate-500">Học viên</p>
								</div>
							</div>
							<textarea
								placeholder="Bạn đang nghĩ gì? Chia sẻ kiến thức hoặc đặt câu hỏi nhé!"
								value={newPostContent}
								onChange={(e) => setNewPostContent(e.target.value)}
								className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
								rows={6}
							/>
							<div className="flex items-center gap-2 mt-3">
								<button type="button" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
									<Image className="w-5 h-5" />
								</button>
								<button type="button" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
									<Paperclip className="w-5 h-5" />
								</button>
								<button type="button" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
									<Link2 className="w-5 h-5" />
								</button>
								<div className="flex-1" />
								<button
									type="button"
									onClick={handleCreatePost}
									disabled={!newPostContent.trim()}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Đăng bài
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Post Detail Modal */}
			{selectedPost && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div 
						className="absolute inset-0 bg-black/50" 
						onClick={() => setSelectedPost(null)}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === "Escape" && setSelectedPost(null)}
					/>
					<div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
						<div className="flex items-center justify-between p-4 border-b border-slate-200">
							<h2 className="text-lg font-semibold text-slate-900">Bài viết</h2>
							<button
								type="button"
								onClick={() => setSelectedPost(null)}
								className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="p-4">
							<div className="flex items-center gap-3 mb-3">
								<div className={`w-10 h-10 bg-gradient-to-r ${selectedPost.author.avatar} rounded-full flex items-center justify-center`}>
									<User className="w-5 h-5 text-white" />
								</div>
								<div>
									<p className="font-medium text-slate-900">{selectedPost.author.name}</p>
									<p className="text-xs text-slate-500">{selectedPost.createdAt}</p>
								</div>
							</div>
							<p className="text-slate-700 mb-4 whitespace-pre-wrap">{selectedPost.content}</p>
							
							{/* All Comments */}
							<div className="border-t border-slate-200 pt-4">
								<h3 className="font-medium text-slate-900 mb-3">Bình luận ({postComments[selectedPost.id]?.length || 0})</h3>
								<div className="space-y-4 mb-4">
									{(postComments[selectedPost.id] || []).map((comment) => (
										<div key={comment.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
											<div className="flex gap-3">
												<div className={`w-10 h-10 bg-gradient-to-r ${comment.author.avatar} rounded-full flex items-center justify-center shrink-0`}>
													<User className="w-5 h-5 text-white" />
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-medium text-slate-900">{comment.author.name}</span>
														<span className="text-xs text-slate-400">- {comment.createdAt}</span>
													</div>
													<p className="text-slate-600 text-sm mb-2">{comment.content}</p>
													<div className="flex items-center gap-4">
														<button type="button" className="flex items-center gap-1 text-sm text-slate-400 hover:text-blue-600">
															<Heart className="w-4 h-4" />
															<span>{comment.likes}</span>
														</button>
														<button type="button" className="text-sm text-slate-400 hover:text-red-600">
															Trả lời
														</button>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
								<textarea
									placeholder="Viết bình luận..."
									value={newComments[selectedPost.id] || ""}
									onChange={(e) => setNewComments({ ...newComments, [selectedPost.id]: e.target.value })}
									className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
									rows={4}
								/>
								<ActionButton className="mt-3" onClick={() => handleAddComment(selectedPost.id)}>
									Gửi bình luận
								</ActionButton>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Chat Widget */}
			{showChat && (
				<div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between p-3 bg-blue-600 text-white">
						<div className="flex items-center gap-2">
							{currentChatUser ? (
								<>
									<button
										type="button"
										onClick={() => setCurrentChatUser(null)}
										className="p-1 hover:bg-white/20 rounded"
									>
										<ChevronDown className="w-4 h-4 rotate-90" />
									</button>
									<div className="flex items-center gap-2">
										<div className={`w-8 h-8 bg-gradient-to-r ${currentChatUser.avatar} rounded-full flex items-center justify-center`}>
											<User className="w-4 h-4 text-white" />
										</div>
										<span className="font-medium">{currentChatUser.name}</span>
									</div>
								</>
							) : (
								<>
									<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
										<MessageCircle className="w-4 h-4" />
									</div>
									<span className="font-medium">Chat</span>
								</>
							)}
						</div>
						<div className="flex items-center gap-1">
							<button 
								type="button" 
								onClick={() => currentChatUser && setChatNotifications({ ...chatNotifications, [currentChatUser.id]: !chatNotifications[currentChatUser.id] })}
								className="p-1 hover:bg-white/20 rounded"
								title={currentChatUser && chatNotifications[currentChatUser.id] ? "Tắt thông báo" : "Bật thông báo"}
							>
								{currentChatUser && chatNotifications[currentChatUser.id] ? (
									<Bell className="w-4 h-4" />
								) : (
									<BellOff className="w-4 h-4" />
								)}
							</button>
							<button type="button" onClick={() => setShowChat(false)} className="p-1 hover:bg-white/20 rounded">
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* User List (when no chat selected) */}
					{!currentChatUser ? (
						<div className="max-h-64 overflow-y-auto">
							<div className="p-2 border-b border-slate-100">
								<p className="text-xs text-slate-500 px-2 py-1">Chọn người để chat</p>
							</div>
							{[
								{ id: 1, name: "Nguyễn Văn A", avatar: "from-blue-500 to-indigo-600", status: "online" },
								{ id: 2, name: "Trần Thị B", avatar: "from-pink-500 to-rose-600", status: "online" },
								{ id: 3, name: "Lê Văn C", avatar: "from-green-500 to-teal-600", status: "busy" },
								{ id: 4, name: "Phạm Thị D", avatar: "from-purple-500 to-indigo-600", status: "offline" },
							].map((user) => (
								<button
									key={user.id}
									type="button"
									onClick={() => setCurrentChatUser(user)}
									className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 border-b border-slate-100"
								>
									<div className="relative">
										<div className={`w-10 h-10 bg-gradient-to-r ${user.avatar} rounded-full flex items-center justify-center`}>
											<User className="w-5 h-5 text-white" />
										</div>
										<span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
											user.status === "online" ? "bg-green-500" : user.status === "busy" ? "bg-red-500" : "bg-slate-400"
										}`} />
									</div>
									<div className="flex-1 text-left">
										<p className="font-medium text-slate-900 text-sm">{user.name}</p>
										<p className="text-xs text-slate-500">{user.status === "online" ? "Đang hoạt động" : user.status === "busy" ? "Bận" : "Offline"}</p>
									</div>
									{chatNotifications[user.id] && (
										<span className="w-2 h-2 bg-blue-500 rounded-full" />
									)}
								</button>
							))}
						</div>
					) : (
						<>
							{/* Messages */}
							<div className="h-64 overflow-y-auto p-3 space-y-3">
								<div className="flex gap-2">
									<div className={`w-8 h-8 bg-gradient-to-r ${currentChatUser.avatar} rounded-full flex items-center justify-center shrink-0`}>
										<User className="w-4 h-4 text-white" />
									</div>
									<button
										type="button"
										onClick={() => setReplyToMessage({ id: 1, name: currentChatUser.name, content: "Xin chào! Bạn cần hỗ trợ gì không?" })}
										className="bg-slate-100 p-2 rounded-lg rounded-tl-none text-sm text-slate-600 text-left hover:bg-slate-200"
									>
										Xin chào! Bạn cần hỗ trợ gì không?
									</button>
								</div>
								<div className="flex gap-2 justify-end">
									<button
										type="button"
										onClick={() => setReplyToMessage({ id: 2, name: "Bạn", content: "Mình cần hỏi về khóa học React" })}
										className="bg-blue-600 text-white p-2 rounded-lg rounded-br-none text-sm text-left hover:bg-blue-700"
									>
										Mình cần hỏi về khóa học React
									</button>
								</div>
							</div>

							{/* Reply Section */}
							{replyToMessage && (
								<div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
									<Reply className="w-4 h-4 text-slate-400" />
									<div className="flex-1">
										<p className="text-xs text-slate-500">Trả lời {replyToMessage.name}</p>
										<p className="text-xs text-slate-700 truncate">{replyToMessage.content}</p>
									</div>
									<button type="button" onClick={() => setReplyToMessage(null)} className="p-1 hover:bg-slate-200 rounded">
										<X className="w-3 h-3" />
									</button>
								</div>
							)}

							{/* Input */}
							<div className="p-3 border-t border-slate-200">
								<div className="flex gap-2">
									<input
										type="text"
										placeholder="Nhập tin nhắn..."
										className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
									/>
									<button type="button" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
										<Send className="w-4 h-4" />
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			)}

			{/* Chat Toggle Button */}
			{!showChat && (
				<button
					type="button"
					onClick={() => setShowChat(true)}
					className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
				>
					<MessageCircle className="w-6 h-6" />
				</button>
			)}

			{/* Create Group Modal */}
			{createGroupModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div 
						className="absolute inset-0 bg-black/50" 
						onClick={() => setCreateGroupModal(false)}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === "Escape" && setCreateGroupModal(false)}
					/>
					<div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-slate-900">Tạo nhóm mới</h2>
							<button
								type="button"
								onClick={() => setCreateGroupModal(false)}
								className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Tên nhóm</label>
								<input
									type="text"
									placeholder="Nhập tên nhóm..."
									className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
								<textarea
									placeholder="Mô tả về nhóm..."
									rows={3}
									className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
								/>
							</div>
							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => setCreateGroupModal(false)}
									className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
								>
									Hủy
								</button>
								<button
									type="button"
									onClick={handleCreateGroup}
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
								>
									Tạo nhóm
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Invite to Group Modal */}
			{inviteToGroupModal.open && inviteToGroupModal.group && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div 
						className="absolute inset-0 bg-black/50" 
						onClick={() => setInviteToGroupModal({ group: null, open: false })}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === "Escape" && setInviteToGroupModal({ group: null, open: false })}
					/>
					<div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-slate-900">Mời vào nhóm</h2>
							<button
								type="button"
								onClick={() => setInviteToGroupModal({ group: null, open: false })}
								className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<p className="text-sm text-slate-600 mb-4">
							Mời bạn bè tham gia nhóm <span className="font-medium">{inviteToGroupModal.group.name}</span>
						</p>
						<div className="space-y-2 max-h-64 overflow-y-auto">
							{friends.filter(f => !f.status || f.status === "online").map((friend) => (
								<div key={friend.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
									<div className={`w-10 h-10 bg-gradient-to-r ${friend.avatar} rounded-full flex items-center justify-center`}>
										<User className="w-5 h-5 text-white" />
									</div>
									<div className="flex-1">
										<p className="font-medium text-slate-900">{friend.name}</p>
										<p className="text-xs text-slate-500">{friend.mutualFriends} bạn chung</p>
									</div>
									<button
										type="button"
										onClick={() => handleInviteToGroup(inviteToGroupModal.group)}
										className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
									>
										Mời
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Add Friend Modal */}
			{addFriendModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div 
						className="absolute inset-0 bg-black/50" 
						onClick={() => setAddFriendModal(false)}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === "Escape" && setAddFriendModal(false)}
					/>
					<div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-slate-900">Thêm bạn bè</h2>
							<button
								type="button"
								onClick={() => setAddFriendModal(false)}
								className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="relative mb-4">
							<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
							<input
								type="text"
								placeholder="Tìm kiếm người..."
								className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
							/>
						</div>
						<div className="space-y-2 max-h-64 overflow-y-auto">
							{/* Mock users to add */}
							{[
								{ id: 5, name: "Hoàng Văn E", avatar: "from-orange-500 to-red-600", mutualFriends: 6 },
								{ id: 6, name: "Nguyễn Thị F", avatar: "from-cyan-500 to-blue-600", mutualFriends: 3 },
								{ id: 7, name: "Trần Văn G", avatar: "from-purple-500 to-pink-600", mutualFriends: 8 },
							].filter(u => !friendList.includes(u.id) && !sentFriendRequests.includes(u.id)).map((user) => (
								<div key={user.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
									<div className={`w-10 h-10 bg-gradient-to-r ${user.avatar} rounded-full flex items-center justify-center`}>
										<User className="w-5 h-5 text-white" />
									</div>
									<div className="flex-1">
										<p className="font-medium text-slate-900">{user.name}</p>
										<p className="text-xs text-slate-500">{user.mutualFriends} bạn chung</p>
									</div>
									<button
										type="button"
										onClick={() => handleSendFriendRequest(user.id)}
										className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
									>
										Kết bạn
									</button>
								</div>
							))}
							{sentFriendRequests.length > 0 && (
								<div className="mt-4 pt-4 border-t border-slate-200">
									<p className="text-sm text-slate-500 mb-2">Đã gửi lời mời:</p>
									{[
										{ id: 5, name: "Hoàng Văn E", avatar: "from-orange-500 to-red-600" },
										{ id: 6, name: "Nguyễn Thị F", avatar: "from-cyan-500 to-blue-600" },
									].filter(u => sentFriendRequests.includes(u.id)).map((user) => (
										<div key={user.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg mb-2">
											<div className={`w-8 h-8 bg-gradient-to-r ${user.avatar} rounded-full flex items-center justify-center`}>
												<User className="w-4 h-4 text-white" />
											</div>
											<div className="flex-1">
												<p className="font-medium text-slate-900 text-sm">{user.name}</p>
											</div>
											<span className="text-xs text-slate-500">Đã gửi</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* User Profile Modal */}
			{userProfileModal.open && userProfileModal.user && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div 
						className="absolute inset-0 bg-black/50" 
						onClick={() => setUserProfileModal({ user: null, open: false })}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === "Escape" && setUserProfileModal({ user: null, open: false })}
					/>
					<div className="relative bg-white rounded-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
						<div className="p-6 border-b border-slate-200">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-semibold text-slate-900">Hồ sơ người dùng</h2>
								<button
									type="button"
									onClick={() => setUserProfileModal({ user: null, open: false })}
									className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
							<div className="flex items-center gap-4">
								<div className={`w-16 h-16 bg-gradient-to-r ${userProfileModal.user.avatar} rounded-full flex items-center justify-center`}>
									<User className="w-8 h-8 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-slate-900">{userProfileModal.user.name}</h3>
									<p className="text-sm text-slate-500">{userProfileModal.user.role}</p>
									{userProfileModal.user.intro && (
										<p className="text-sm text-slate-600 mt-1">{userProfileModal.user.intro}</p>
									)}
									<p className="text-xs text-slate-400 mt-1">Tham gia: 3 tháng trước</p>
								</div>
							</div>
							<div className="flex gap-4 mt-4">
								<div className="text-center">
									<p className="text-lg font-semibold text-slate-900">12</p>
									<p className="text-xs text-slate-500">Bài viết</p>
								</div>
								<div className="text-center">
									<p className="text-lg font-semibold text-slate-900">48</p>
									<p className="text-xs text-slate-500">Tương tác</p>
								</div>
								<div className="text-center">
									<p className="text-lg font-semibold text-slate-900">5</p>
									<p className="text-xs text-slate-500">Được lưu</p>
								</div>
							</div>
						</div>
						<div className="p-4 max-h-64 overflow-y-auto">
							<div className="space-y-3">
								{posts.filter(p => p.author.name === userProfileModal.user?.name).map((p) => (
									<button
										key={p.id}
										type="button"
										onClick={() => {
											setUserProfileModal({ user: null, open: false });
											setSelectedPost(p);
										}}
										className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
									>
										<p className="text-sm text-slate-700 line-clamp-2">{p.content}</p>
										<div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
											<span>{p.likes} thích</span>
											<span>{p.comments} bình luận</span>
											<span>{p.createdAt}</span>
										</div>
									</button>
								))}
								{posts.filter(p => p.author.name === userProfileModal.user?.name).length === 0 && (
									<p className="text-sm text-slate-400 text-center py-4">Chưa có bài viết nào</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Report Modal */}
			{reportModal.open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div 
						className="absolute inset-0 bg-black/50" 
						onClick={() => setReportModal({ post: null, open: false })}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === "Escape" && setReportModal({ post: null, open: false })}
					/>
					<div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-slate-900">Báo cáo người dùng</h2>
							<button
								type="button"
								onClick={() => setReportModal({ post: null, open: false })}
								className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						{reportSuccess ? (
							<div className="text-center py-8">
								<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
									<Flag className="w-6 h-6 text-green-600" />
								</div>
								<p className="text-green-600 font-medium">Báo cáo đã gửi thành công!</p>
								<p className="text-slate-500 text-sm mt-1">Cảm ơn bạn đã đóng góp.</p>
							</div>
						) : (
							<>
								<p className="text-sm text-slate-600 mb-4">
									Báo cáo bài viết của <span className="font-medium">{reportModal.post?.author.name}</span>
								</p>
								<div className="mb-4">
									<label className="block text-sm font-medium text-slate-700 mb-2">Lý do</label>
									<div className="grid grid-cols-2 gap-2">
										{reportReasons.map((reason) => (
											<button
												key={reason}
												type="button"
												onClick={() => setReportReason(reason)}
												className={`px-3 py-2 text-sm rounded-lg border ${
													reportReason === reason
														? "border-blue-500 bg-blue-50 text-blue-700"
														: "border-slate-200 text-slate-700 hover:bg-slate-50"
												}`}
											>
												{reason}
											</button>
										))}
									</div>
								</div>
								<div className="mb-4">
									<label className="block text-sm font-medium text-slate-700 mb-2">Chi tiết (tùy chọn)</label>
									<textarea
										value={reportDetails}
										onChange={(e) => setReportDetails(e.target.value)}
										placeholder="Mô tả thêm để quản trị viên xử lý nhanh hơn..."
										className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
									/>
								</div>
								<div className="flex gap-3">
									<button
										type="button"
										onClick={() => setReportModal({ post: null, open: false })}
										className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
									>
										Hủy
									</button>
									<button
										type="button"
										onClick={handleSubmitReport}
										disabled={!reportReason || reportLoading}
										className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{reportLoading ? "Đang gửi..." : "Gửi báo cáo"}
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ForumPage;
