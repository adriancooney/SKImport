/**
 * @author Adrian Cooney <cooney.adrian@gmail.com>
 * @license MIT
 * @homepage http://github.com/adriancooney/SKImport
 *
 * Be sure to couple this with the editor!
 */

#import <Foundation/Foundation.h>
#import <SpriteKit/SpriteKit.h>

@interface SKPhysicsBody (SKPhysicsBodyImport)
+(SKPhysicsBody *) bodyWithFile: (NSString *) file;
+(id) getJSONData: (NSString *) file;
+(BOOL) verifyJSONFile: (id) data;
+(SKPhysicsBody *) createBody: (NSArray *) body;
+(UIBezierPath *) generatePathFromArrayOfPoint: (NSArray *) points;
@end
