/// User model for DevVault
class User {
  final String id;
  final String username;
  final String email;
  final DateTime? createdAt;

  const User({
    required this.id,
    required this.username,
    required this.email,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'] ?? '',
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      createdAt: json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  @override
  String toString() => 'User(id: $id, username: $username, email: $email)';
}
