import 'package:flutter/material.dart';
import '../models/component.dart';
import '../theme/app_theme.dart';

/// Component card widget for displaying in list/grid
class ComponentCard extends StatelessWidget {
  final Component component;
  final VoidCallback? onTap;

  const ComponentCard({
    super.key,
    required this.component,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title row
              Row(
                children: [
                  Expanded(
                    child: Text(
                      component.title,
                      style: AppTheme.bodyLarge.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    component.privacyIcon,
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
              ),
              
              const SizedBox(height: 8),
              
              // Description
              if (component.description != null && component.description!.isNotEmpty)
                Text(
                  component.description!,
                  style: AppTheme.bodyMedium,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                )
              else
                Text(
                  'No description',
                  style: AppTheme.bodyMedium.copyWith(
                    fontStyle: FontStyle.italic,
                  ),
                ),
              
              const Spacer(),
              
              // Language badge
              Row(
                children: [
                  _LanguageBadge(language: component.displayLanguage),
                  const Spacer(),
                  if (component.createdAt != null)
                    Text(
                      _formatDate(component.createdAt!),
                      style: AppTheme.bodyMedium.copyWith(fontSize: 12),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    
    if (diff.inDays == 0) {
      return 'Today';
    } else if (diff.inDays == 1) {
      return 'Yesterday';
    } else if (diff.inDays < 7) {
      return '${diff.inDays}d ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}

/// Language badge widget
class _LanguageBadge extends StatelessWidget {
  final String language;

  const _LanguageBadge({required this.language});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppTheme.getLanguageColor(language).withOpacity(0.2),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(
          color: AppTheme.getLanguageColor(language).withOpacity(0.5),
        ),
      ),
      child: Text(
        language,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AppTheme.getLanguageColor(language),
        ),
      ),
    );
  }
}
