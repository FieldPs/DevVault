/// Component model for DevVault
class Component {
  final String id;
  final String title;
  final String? description;
  final String code;
  final String? cssCode;
  final String language;
  final String? template;
  final String privacy; // 'private', 'friends', 'public'
  final String? folderId;
  final String userId;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const Component({
    required this.id,
    required this.title,
    this.description,
    required this.code,
    this.cssCode,
    required this.language,
    this.template,
    required this.privacy,
    this.folderId,
    required this.userId,
    this.createdAt,
    this.updatedAt,
  });

  factory Component.fromJson(Map<String, dynamic> json) {
    return Component(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      code: json['code'] ?? '',
      cssCode: json['cssCode'],
      language: json['language'] ?? 'javascript',
      template: json['template'],
      privacy: json['privacy'] ?? 'private',
      folderId: json['folder'],
      userId: json['user'] ?? '',
      createdAt: json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt']) 
          : null,
      updatedAt: json['updatedAt'] != null 
          ? DateTime.tryParse(json['updatedAt']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'code': code,
      'cssCode': cssCode,
      'language': language,
      'template': template,
      'privacy': privacy,
      'folder': folderId,
      'user': userId,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  /// Get display language name
  String get displayLanguage {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'JavaScript';
      case 'typescript':
      case 'ts':
        return 'TypeScript';
      case 'html':
        return 'HTML';
      case 'css':
        return 'CSS';
      default:
        return language;
    }
  }

  /// Get privacy display name
  String get displayPrivacy {
    switch (privacy) {
      case 'private':
        return 'Private';
      case 'friends':
        return 'Friends';
      case 'public':
        return 'Public';
      default:
        return privacy;
    }
  }

  /// Get privacy icon
  String get privacyIcon {
    switch (privacy) {
      case 'private':
        return '🔒';
      case 'friends':
        return '👥';
      case 'public':
        return '🌐';
      default:
        return '📝';
    }
  }

  @override
  String toString() => 'Component(id: $id, title: $title, language: $language)';
}
